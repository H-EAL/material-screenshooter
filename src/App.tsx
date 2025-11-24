//------------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Livelink,
    Canvas,
    Viewport,
    useCameraEntity,
    useEntity,
    useEntities,
} from "@3dverse/livelink-react";
import { LoadingOverlay } from "@3dverse/livelink-react-ui";
import { MaterialEditor } from "./MaterialEditor";
import { PresetPanel } from "./PresetPanel";
import { materialPresets } from "./MaterialPresets";
import { environmentPresets, type EnvironmentPreset } from "./EnvironmentPresets";
import materialSchema from "./assets/pbr_material_shader.schema.json";
import { setApiKey, listAssets, type ListAssets_Object } from "@3dverse/api";

//------------------------------------------------------------------------------
import "./App.css";

//------------------------------------------------------------------------------
const scene_id = "5e00acaf-d773-46fe-9050-c4710f7c3fdf";
const token = "public_dDcRaI53doYz81OS";
const CANVAS_SIZE = 800;

//------------------------------------------------------------------------------
function ConnectionError() {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-red-900/80 border-2 border-red-500 rounded-xl p-8 max-w-md text-center shadow-2xl">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Connection Lost</h2>
                <p className="text-red-200 mb-4">
                    Lost connection to 3dverse. This may be due to a network issue, server timeout,
                    or session crash. Please reload the page to reconnect.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
}

//------------------------------------------------------------------------------
export function App() {
    return (
        <Livelink
            sceneId={scene_id}
            token={token}
            LoadingPanel={LoadingOverlay}
            ConnectionErrorPanel={ConnectionError}
            isTransient={true}
            autoJoinExisting={false}
        >
            <AppLayout />
        </Livelink>
    );
}

//------------------------------------------------------------------------------
function AppLayout() {
    const { cameraEntity } = useCameraEntity();
    const { entity: materialEntity } = useEntity({ euid: "5eb77a7a-88dc-4d7c-889d-73b328a3ec29" }, [
        "material",
    ]);
    const { entities: envEntities } = useEntities({ mandatory_components: ["environment"] }, [
        "environment",
    ]);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [batchProgress, setBatchProgress] = useState<string>("");
    const [selectedEnvironment, setSelectedEnvironment] = useState<string>(
        environmentPresets[0]?.name || ""
    );
    const [customShaderUUID, setCustomShaderUUID] = useState<string>("");
    const [orbitAngles, setOrbitAngles] = useState<{ theta: number; phi: number } | null>(null);
    const [orbitDistance, setOrbitDistance] = useState<number | null>(null);
    const [isAutoRotate, setIsAutoRotate] = useState(false);
    const [apiKey, setApiKeyState] = useState<string>(import.meta.env.VITE_API_KEY || "");
    const [availableTextures, setAvailableTextures] = useState<ListAssets_Object[]>([]);
    const [isLoadingTextures, setIsLoadingTextures] = useState(false);

    // Memoize the entities array to prevent infinite re-renders
    const materialEntities = useMemo(
        () => (materialEntity ? [materialEntity] : []),
        [materialEntity]
    );

    // Initialize orbit angles and distance from camera's starting position
    useEffect(() => {
        if (!cameraEntity || !cameraEntity.global_transform) return;
        if (orbitAngles !== null) return; // Only initialize once

        const pos = cameraEntity.global_transform.position;
        const target = [0, 1, 0];

        // Calculate distance from camera to target
        const dx = pos[0] - target[0];
        const dy = pos[1] - target[1];
        const dz = pos[2] - target[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Calculate spherical coordinates from Cartesian position
        const theta = Math.atan2(dz, dx);
        const phi = Math.acos(dy / distance);

        setOrbitDistance(distance);
        setOrbitAngles({ theta, phi });
    }, [cameraEntity, orbitAngles]);

    useEffect(() => {
        if (!cameraEntity) return;
        if (cameraEntity.perspective_lens == null) return;
        cameraEntity.perspective_lens.fovy = 18;
    }, [cameraEntity]);

    // Update camera position based on orbit angles
    useEffect(() => {
        if (!cameraEntity || orbitAngles === null || orbitDistance === null) return;

        const target = [0, 1, 0];
        const { theta, phi } = orbitAngles;

        // Spherical to Cartesian conversion
        const x = target[0] + orbitDistance * Math.sin(phi) * Math.cos(theta);
        const y = target[1] + orbitDistance * Math.cos(phi);
        const z = target[2] + orbitDistance * Math.sin(phi) * Math.sin(theta);

        // Calculate direction vector (from camera to target)
        const dirX = target[0] - x;
        const dirY = target[1] - y;
        const dirZ = target[2] - z;
        const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const dir = [dirX / len, dirY / len, dirZ / len];

        // Calculate right vector (cross product of direction and up)
        const up = [0, 1, 0];
        const right = [
            dir[1] * up[2] - dir[2] * up[1],
            dir[2] * up[0] - dir[0] * up[2],
            dir[0] * up[1] - dir[1] * up[0],
        ];
        const rightLen = Math.sqrt(right[0] * right[0] + right[1] * right[1] + right[2] * right[2]);
        right[0] /= rightLen;
        right[1] /= rightLen;
        right[2] /= rightLen;

        // Convert to quaternion (simplified - assumes camera looking along -Z axis)
        const angle = Math.atan2(-dir[0], -dir[2]);
        const pitch = Math.asin(dir[1]);

        const cy = Math.cos(angle * 0.5);
        const sy = Math.sin(angle * 0.5);
        const cp = Math.cos(pitch * 0.5);
        const sp = Math.sin(pitch * 0.5);

        const qw = cy * cp;
        const qx = cy * sp;
        const qy = sy * cp;
        const qz = -sy * sp;

        // Update camera transform
        if (cameraEntity.global_transform) {
            cameraEntity.global_transform.position = [x, y, z];
            cameraEntity.global_transform.orientation = [qx, qy, qz, qw];
        }
    }, [cameraEntity, orbitAngles, orbitDistance]);

    // Auto-rotate effect
    useEffect(() => {
        if (!isAutoRotate || orbitAngles === null) return;

        const intervalId = setInterval(() => {
            setOrbitAngles((prev) => {
                if (!prev) return prev;
                let newTheta = prev.theta + 0.01;
                // Wrap around between -PI and PI
                if (newTheta > Math.PI) {
                    newTheta = -Math.PI + (newTheta - Math.PI);
                }
                return {
                    theta: newTheta,
                    phi: prev.phi,
                };
            });
        }, 16); // ~60fps

        return () => clearInterval(intervalId);
    }, [isAutoRotate, orbitAngles]);

    // Slider handler for orbit control
    const handleOrbitSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (orbitAngles === null) return;

        const value = parseFloat(e.target.value);
        setOrbitAngles((prev) => {
            if (!prev) return prev;
            return {
                theta: value,
                phi: prev.phi,
            };
        });
    };

    const handleToggleAutoRotate = () => {
        setIsAutoRotate((prev) => !prev);
    };

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKeyState(e.target.value);
    };

    const handleFetchTextures = async () => {
        if (!apiKey.trim()) {
            alert("Please enter an API key");
            return;
        }

        setIsLoadingTextures(true);
        try {
            // Set the API key for the @3dverse/api library
            setApiKey(apiKey);

            // Fetch textures from the API
            const response = await listAssets({
                offset: 0,
                limit: 1000,
                filter: {
                    asset_type: "texture",
                },
            });

            const textures = response.data.textures || [];
            setAvailableTextures(textures);
            console.log(`Loaded ${textures.length} textures`);
        } catch (error) {
            console.error("Failed to fetch textures:", error);
            alert("Failed to fetch textures. Please check your API key.");
        } finally {
            setIsLoadingTextures(false);
        }
    };

    const handleApplyPreset = (presetName: string) => {
        setSelectedPreset(presetName);
        // Reset after a short delay to allow the same preset to be applied again
        setTimeout(() => setSelectedPreset(undefined), 100);
    };

    const handleApplyEnvironment = (envPreset: EnvironmentPreset) => {
        if (envEntities.length === 0) return;

        const envEntity = envEntities[0];
        if (!envEntity.environment) return;

        // Apply the environment UUIDs
        envEntity.environment.skyboxUUID = envPreset.skyboxUUID;
        envEntity.environment.radianceUUID = envPreset.radianceUUID;
        envEntity.environment.irradianceUUID = envPreset.irradianceUUID;

        setSelectedEnvironment(envPreset.name);
    };

    const handleEnvironmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const envName = e.target.value;
        const preset = environmentPresets.find((p) => p.name === envName);
        if (preset) {
            handleApplyEnvironment(preset);
        }
    };

    const handleShaderUUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uuid = e.target.value;
        setCustomShaderUUID(uuid);
    };

    const handleApplyShaderUUID = () => {
        const uuid = customShaderUUID.trim();

        // Apply the shader UUID if valid and entity exists
        if (uuid && materialEntity?.material) {
            console.log("Applying shader UUID:", uuid);
            materialEntity.material.shaderRef = uuid;
        }
    };

    const handleShaderUUIDKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleApplyShaderUUID();
        }
    };

    const handleResetMaterial = () => {
        if (!materialEntity?.material) return;

        // Reset to default values from schema
        const defaultData: Record<string, unknown> = {};

        interface InputDescriptor {
            name: string;
            default: number | string | number[] | boolean;
        }

        interface ConstantDescriptor {
            name: string;
            default: boolean;
        }

        // Set all inputs to their default values
        (materialSchema.inputDescriptor as InputDescriptor[]).forEach((input) => {
            defaultData[input.name] = input.default;
        });

        materialEntity.material.dataJSON = defaultData as typeof materialEntity.material.dataJSON;

        // Reset constants to defaults
        const defaultConstants: Record<string, boolean> = {};
        (materialSchema.constantDescriptor as ConstantDescriptor[]).forEach((constant) => {
            defaultConstants[constant.name] = constant.default;
        });
        materialEntity.material.constantsJSON =
            defaultConstants as typeof materialEntity.material.constantsJSON;

        // Reset to opaque shader
        const OPAQUE_SHADER = "f2a549e5-4f72-4cef-a5ab-48873c209e0c";
        materialEntity.material.shaderRef = OPAQUE_SHADER;

        console.log("Material reset to default values");
    };

    const handleScreenshot = () => {
        const canvasWrapper = canvasRef.current;
        if (!canvasWrapper) return;

        // Get the canvas element inside the Canvas component
        const canvasElement = canvasWrapper.querySelector("canvas");
        if (!canvasElement) return;

        // Get material properties from the entity
        if (!materialEntity?.material?.dataJSON) return;

        const albedo = materialEntity.material.dataJSON.albedo as number[] | undefined;
        const roughness = materialEntity.material.dataJSON.roughness as number | undefined;
        const metallic = materialEntity.material.dataJSON.metallic as number | undefined;

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
                            if (!materialEntity?.material?.dataJSON) {
                                resolve();
                                return;
                            }

                            const albedo = materialEntity.material.dataJSON.albedo as
                                | number[]
                                | undefined;
                            const roughness = materialEntity.material.dataJSON.roughness as
                                | number
                                | undefined;
                            const metallic = materialEntity.material.dataJSON.metallic as
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
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            {/* Header */}
            <div className="flex-none bg-black/40 backdrop-blur-sm border-b border-gray-700 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Material Screenshooter</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Create and capture PBR materials
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-400">Environment:</label>
                        <select
                            value={selectedEnvironment}
                            onChange={handleEnvironmentChange}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors min-w-[200px]"
                        >
                            {environmentPresets.map((preset) => (
                                <option key={preset.name} value={preset.name}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                        <label className="text-sm text-gray-400 ml-4">Shader UUID:</label>
                        <input
                            type="text"
                            value={customShaderUUID}
                            onChange={handleShaderUUIDChange}
                            onBlur={handleApplyShaderUUID}
                            onKeyDown={handleShaderUUIDKeyDown}
                            placeholder="Enter shader UUID and press Enter"
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors min-w-[300px] font-mono text-sm"
                        />
                        <button
                            onClick={handleResetMaterial}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all ml-4"
                            title="Reset material dataJSON"
                        >
                            🔄 Reset Material
                        </button>
                        <label className="text-sm text-gray-400 ml-4">API Key:</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter API key"
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors min-w-[200px] font-mono text-sm"
                        />
                        <button
                            onClick={handleFetchTextures}
                            disabled={isLoadingTextures || !apiKey.trim()}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            title="Load textures from project"
                        >
                            {isLoadingTextures ? "⏳ Loading..." : "📦 Load Textures"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center gap-8 p-8 overflow-hidden">
                {/* Material Editor Panel */}
                <div className="w-96 h-full max-h-[900px] overflow-hidden">
                    {materialEntity ? (
                        <MaterialEditor
                            entities={materialEntities}
                            presetToApply={selectedPreset}
                            availableTextures={availableTextures}
                        />
                    ) : (
                        <div className="bg-black/80 text-white p-4 rounded-lg">
                            <p>Loading entity...</p>
                        </div>
                    )}
                </div>

                {/* Canvas Container */}
                <div className="flex flex-col gap-4 items-center">
                    <div className="relative shrink-0 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <Canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE}>
                            <Viewport
                                cameraEntity={cameraEntity}
                                className="w-full h-full"
                            ></Viewport>
                        </Canvas>
                    </div>

                    {/* Camera Orbit Slider */}
                    {orbitAngles !== null && (
                        <div className="w-full max-w-md">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-gray-400">Camera Rotation</label>
                                <button
                                    onClick={handleToggleAutoRotate}
                                    className={`text-xs font-semibold py-1 px-3 rounded transition-all ${
                                        isAutoRotate
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                    }`}
                                >
                                    {isAutoRotate ? "🔄 Auto-Rotate ON" : "⏸ Auto-Rotate OFF"}
                                </button>
                            </div>
                            <input
                                type="range"
                                min={-Math.PI}
                                max={Math.PI}
                                step={0.01}
                                value={orbitAngles.theta}
                                onChange={handleOrbitSliderChange}
                                disabled={isAutoRotate}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}

                    {/* Action Buttons Below Canvas */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleScreenshot}
                            disabled={isBatchProcessing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all hover:scale-105"
                        >
                            📸 Save Screenshot
                        </button>
                        <button
                            onClick={handleBatchScreenshot}
                            disabled={isBatchProcessing}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all hover:scale-105"
                        >
                            {isBatchProcessing ? "⏳ Processing..." : "🎬 Batch Export"}
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    {batchProgress && (
                        <div className="bg-black/90 text-white text-sm py-3 px-6 rounded-lg shadow-lg border border-green-500/50">
                            {batchProgress}
                        </div>
                    )}
                </div>

                {/* Right Panel - Presets */}
                <div className="w-80 h-full max-h-[900px] overflow-hidden">
                    <PresetPanel onApplyPreset={handleApplyPreset} />
                </div>
            </div>
        </div>
    );
}

export default App;
