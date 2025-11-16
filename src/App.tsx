//------------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { Livelink, Canvas, Viewport, useCameraEntity, useEntities } from "@3dverse/livelink-react";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import { MaterialEditor } from "./MaterialEditor";
import { PresetPanel } from "./PresetPanel";
import { materialPresets } from "./MaterialPresets";

//------------------------------------------------------------------------------
import "./App.css";

//------------------------------------------------------------------------------
const scene_id = "e9f02ff7-e16d-4921-8205-25256b6fdb25";
const token = "public_dDcRaI53doYz81OS";

//------------------------------------------------------------------------------
export function App() {
    return (
        <Livelink sceneId={scene_id} token={token} LoadingPanel={LoadingOverlay}>
            <AppLayout />
        </Livelink>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { cameraEntity } = useCameraEntity();
    const { entities } = useEntities({ mandatory_components: ["material"] }, ["material"]);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [batchProgress, setBatchProgress] = useState<string>("");

    useEffect(() => {
        if (!cameraEntity) return;
        if (cameraEntity.perspective_lens == null) return;
        cameraEntity.perspective_lens.fovy = 18;
    }, [cameraEntity]);

    const handleApplyPreset = (presetName: string) => {
        setSelectedPreset(presetName);
        // Reset after a short delay to allow the same preset to be applied again
        setTimeout(() => setSelectedPreset(undefined), 100);
    };

    const handleScreenshot = () => {
        const canvasWrapper = canvasRef.current;
        if (!canvasWrapper) return;

        // Get the canvas element inside the Canvas component
        const canvasElement = canvasWrapper.querySelector("canvas");
        if (!canvasElement) return;

        // Get material properties from first entity
        const entity = entities[0];
        if (!entity?.material?.dataJSON) return;

        const albedo = entity.material.dataJSON.albedo as number[] | undefined;
        const roughness = entity.material.dataJSON.roughness as number | undefined;
        const metallic = entity.material.dataJSON.metallic as number | undefined;

        // Convert RGB values to hex
        const [r = 1, g = 0, b = 0] = albedo || [];
        const rHex = Math.round(r * 255)
            .toString(16)
            .padStart(2, "0");
        const gHex = Math.round(g * 255)
            .toString(16)
            .padStart(2, "0");
        const bHex = Math.round(b * 255)
            .toString(16)
            .padStart(2, "0");
        const albedoHex = `${rHex}${gHex}${bHex}`;

        // Convert to percentage
        const roughnessPercent = Math.round((roughness || 0.5) * 100);
        const metallicPercent = Math.round((metallic || 0) * 100);

        // Generate filename: mat_[hex]_[roughness]R_[metallic]M.webp
        const filename = `mat_${albedoHex}_${roughnessPercent}R_${metallicPercent}M.webp`;

        canvasElement.toBlob(
            (blob) => {
                if (!blob) return;

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
            },
            "image/webp",
            1
        );
    };

    const handleBatchScreenshot = async () => {
        try {
            // Request directory handle using File System Access API
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dirHandle = await (window as any).showDirectoryPicker({
                mode: "readwrite",
            });

            setIsBatchProcessing(true);
            setBatchProgress(`Processing 0/${materialPresets.length} presets...`);

            const canvasWrapper = canvasRef.current;
            if (!canvasWrapper) {
                setIsBatchProcessing(false);
                return;
            }

            const canvasElement = canvasWrapper.querySelector("canvas");
            if (!canvasElement) {
                setIsBatchProcessing(false);
                return;
            }

            // Process each preset
            for (let i = 0; i < materialPresets.length; i++) {
                const preset = materialPresets[i];

                // Apply the preset
                setSelectedPreset(preset.name);

                // Wait for the material to update and render
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Take screenshot
                await new Promise<void>((resolve) => {
                    canvasElement.toBlob(
                        async (blob) => {
                            if (!blob) {
                                resolve();
                                return;
                            }

                            // Get material properties for filename
                            const entity = entities[0];
                            if (!entity?.material?.dataJSON) {
                                resolve();
                                return;
                            }

                            const albedo = entity.material.dataJSON.albedo as number[] | undefined;
                            const roughness = entity.material.dataJSON.roughness as
                                | number
                                | undefined;
                            const metallic = entity.material.dataJSON.metallic as
                                | number
                                | undefined;

                            const [r = 1, g = 0, b = 0] = albedo || [];
                            const rHex = Math.round(r * 255)
                                .toString(16)
                                .padStart(2, "0");
                            const gHex = Math.round(g * 255)
                                .toString(16)
                                .padStart(2, "0");
                            const bHex = Math.round(b * 255)
                                .toString(16)
                                .padStart(2, "0");
                            const albedoHex = `${rHex}${gHex}${bHex}`;

                            const roughnessPercent = Math.round((roughness || 0.5) * 100);
                            const metallicPercent = Math.round((metallic || 0) * 100);

                            const filename = `mat_${albedoHex}_${roughnessPercent}R_${metallicPercent}M.webp`;

                            // Write file to selected directory
                            try {
                                const fileHandle = await dirHandle.getFileHandle(filename, {
                                    create: true,
                                });
                                const writable = await fileHandle.createWritable();
                                await writable.write(blob);
                                await writable.close();
                            } catch (error) {
                                console.error("Error writing file:", error);
                            }

                            resolve();
                        },
                        "image/webp",
                        1
                    );
                });

                // Update progress
                setBatchProgress(`Processing ${i + 1}/${materialPresets.length} presets...`);

                // Reset selected preset
                setSelectedPreset(undefined);

                // Small delay between presets
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            setBatchProgress(`Complete! ${materialPresets.length} screenshots saved.`);
            setTimeout(() => {
                setIsBatchProcessing(false);
                setBatchProgress("");
            }, 3000);
        } catch (error) {
            console.error("Batch screenshot error:", error);
            setIsBatchProcessing(false);
            setBatchProgress("");
            alert(
                "Batch screenshot cancelled or failed. Make sure your browser supports the File System Access API."
            );
        }
    };

    return (
        <div className="flex gap-4 p-4 h-screen overflow-hidden">
            {/* Material Editor */}
            <div className="w-80 h-full overflow-hidden">
                {entities.length > 0 ? (
                    <MaterialEditor entities={entities} presetToApply={selectedPreset} />
                ) : (
                    <div className="bg-black/80 text-white p-4 rounded-lg">
                        <p>Loading entities...</p>
                    </div>
                )}
            </div>

            {/* Canvas */}
            <div className="relative shrink-0">
                <Canvas ref={canvasRef} width={800} height={800}>
                    <Viewport cameraEntity={cameraEntity} className="w-full h-full"></Viewport>
                </Canvas>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={handleScreenshot}
                        disabled={isBatchProcessing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded shadow-lg transition-colors"
                    >
                        Save as WebP
                    </button>
                    <button
                        onClick={handleBatchScreenshot}
                        disabled={isBatchProcessing}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded shadow-lg transition-colors"
                    >
                        {isBatchProcessing ? "Processing..." : "Batch Screenshot"}
                    </button>
                    {batchProgress && (
                        <div className="bg-black/80 text-white text-sm py-2 px-4 rounded shadow-lg">
                            {batchProgress}
                        </div>
                    )}
                </div>
            </div>

            {/* Preset Panel */}
            <div className="w-64 h-full overflow-hidden">
                <PresetPanel onApplyPreset={handleApplyPreset} />
            </div>
        </div>
    );
}

export default App;
