import { useState, useEffect, useCallback } from "react";
import materialSchema from "./assets/pbr_material_shader.schema.json";
import { materialPresets } from "./MaterialPresets";

interface MaterialEditorProps {
    entities: Array<{
        material?: {
            dataJSON: Record<string, unknown>;
            shaderRef?: string;
        };
    }>;
    presetToApply?: string;
}

interface InputDescriptor {
    id: number;
    name: string;
    type: string;
    nativeType: string;
    default: number | string | number[] | boolean;
    description: string;
    categories: string[];
    properties?: {
        spec?: Record<string, boolean | undefined>;
        isHidden?: boolean;
        isMandatory?: boolean;
    };
}

export function MaterialEditor({ entities, presetToApply }: MaterialEditorProps) {
    const [materialData, setMaterialData] = useState<Record<string, unknown>>({});
    const [activeCategory, setActiveCategory] = useState<string>("Base");
    const [isTransparent, setIsTransparent] = useState(false);

    // Shader UUIDs
    const OPAQUE_SHADER = "f2a549e5-4f72-4cef-a5ab-48873c209e0c";
    const TRANSPARENT_SHADER = "a740058e-27a0-48e3-af37-70ae93cc0b67";

    // Initialize material data from first entity and check transparency
    useEffect(() => {
        if (entities.length === 0 || !entities[0]?.material?.dataJSON) return;

        const firstEntityMaterial = entities[0].material.dataJSON;
        const data: Record<string, unknown> = {};
        (materialSchema.inputDescriptor as InputDescriptor[]).forEach((input) => {
            const value = firstEntityMaterial[input.name];
            data[input.name] = value !== undefined ? value : input.default;
        });
        setMaterialData(data);

        // Check if material is transparent
        const shaderRef = entities[0].material?.shaderRef;
        setIsTransparent(shaderRef === TRANSPARENT_SHADER);
    }, [entities, TRANSPARENT_SHADER]);

    // Update all entities' materials when data changes
    useEffect(() => {
        if (entities.length === 0) return;

        entities.forEach((entity) => {
            if (!entity?.material?.dataJSON) return;
            Object.entries(materialData).forEach(([key, value]) => {
                entity.material!.dataJSON[key] = value;
            });
        });
    }, [materialData, entities]);

    const updateValue = (name: string, value: unknown) => {
        setMaterialData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTransparency = () => {
        if (entities.length === 0) return;

        const newTransparent = !isTransparent;
        setIsTransparent(newTransparent);

        entities.forEach((entity) => {
            if (!entity?.material) return;
            entity.material.shaderRef = newTransparent ? TRANSPARENT_SHADER : OPAQUE_SHADER;
        });
    };

    const applyPreset = useCallback(
        (presetName: string) => {
            const preset = materialPresets.find((p) => p.name === presetName);
            if (!preset) return;

            const newData: Record<string, unknown> = {
                albedo: preset.properties.albedo,
                roughness: preset.properties.roughness,
                metallic: preset.properties.metallic,
                emission: preset.properties.emission || [0, 0, 0],
                emissionIntensity: preset.properties.emissionIntensity || 0,
            };

            // Add opacity if preset has it
            if (preset.properties.opacity !== undefined) {
                newData.opacity = preset.properties.opacity;
            }

            setMaterialData((prev) => ({
                ...prev,
                ...newData,
            }));

            // Switch to transparent shader for Glass category presets
            if (preset.category === "Glass" && !isTransparent) {
                setIsTransparent(true);
                entities.forEach((entity) => {
                    if (!entity?.material) return;
                    entity.material.shaderRef = TRANSPARENT_SHADER;
                });
            }
            // Switch to opaque shader for non-Glass presets
            else if (preset.category !== "Glass" && isTransparent) {
                setIsTransparent(false);
                entities.forEach((entity) => {
                    if (!entity?.material) return;
                    entity.material.shaderRef = OPAQUE_SHADER;
                });
            }
        },
        [entities, isTransparent, TRANSPARENT_SHADER, OPAQUE_SHADER]
    );

    // Apply preset when presetToApply prop changes
    useEffect(() => {
        if (presetToApply) {
            applyPreset(presetToApply);
        }
    }, [presetToApply, applyPreset]);

    // Check if parameter should be shown based on spec conditions
    const shouldShowParameter = (input: InputDescriptor): boolean => {
        //if (input.properties?.isHidden) return false;

        const spec = input.properties?.spec;
        if (!spec) return true;

        // Check for transparency-related parameters
        if (spec.MATERIAL_TRANSPARENT !== undefined) {
            return spec.MATERIAL_TRANSPARENT === isTransparent;
        }

        // Check all spec conditions
        return Object.entries(spec).every(() => {
            // For now, we'll show all parameters regardless of constants
            // In a full implementation, you'd check the material's constant values
            return true;
        });
    };

    // Get unique categories
    const categories = Array.from(
        new Set(
            (materialSchema.inputDescriptor as InputDescriptor[])
                .filter(shouldShowParameter)
                .flatMap((input) => input.categories)
        )
    );

    // Filter inputs by active category
    const filteredInputs = (materialSchema.inputDescriptor as InputDescriptor[]).filter(
        (input) => shouldShowParameter(input) && input.categories.includes(activeCategory)
    );

    // Render widget based on parameter type
    const renderWidget = (input: InputDescriptor) => {
        const value = materialData[input.name];

        switch (input.type) {
            case "color": {
                // Handle vec3 color (RGB)
                const [r, g, b] = Array.isArray(value) ? value : [1, 1, 1];
                return (
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-red-400">Red: {r.toFixed(2)}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={r}
                                onChange={(e) =>
                                    updateValue(input.name, [parseFloat(e.target.value), g, b])
                                }
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-green-400">Green: {g.toFixed(2)}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={g}
                                onChange={(e) =>
                                    updateValue(input.name, [r, parseFloat(e.target.value), b])
                                }
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-blue-400">Blue: {b.toFixed(2)}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={b}
                                onChange={(e) =>
                                    updateValue(input.name, [r, g, parseFloat(e.target.value)])
                                }
                                className="w-full"
                            />
                        </div>
                        <div
                            className="w-full h-8 rounded border border-white/30"
                            style={{
                                backgroundColor: `rgb(${r * 255}, ${g * 255}, ${b * 255})`,
                            }}
                        />
                    </div>
                );
            }

            case "float": {
                const numValue = typeof value === "number" ? value : input.default;
                const max = input.name.includes("Intensity") ? 10 : 1;
                return (
                    <div>
                        <input
                            type="range"
                            min="0"
                            max={max}
                            step="0.01"
                            value={numValue}
                            onChange={(e) => updateValue(input.name, parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                );
            }

            case "vec2": {
                const [x, y] = Array.isArray(value) ? value : input.default;
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs">X: {x.toFixed(2)}</label>
                            <input
                                type="number"
                                step="0.1"
                                value={x}
                                onChange={(e) =>
                                    updateValue(input.name, [parseFloat(e.target.value), y])
                                }
                                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs">Y: {y.toFixed(2)}</label>
                            <input
                                type="number"
                                step="0.1"
                                value={y}
                                onChange={(e) =>
                                    updateValue(input.name, [x, parseFloat(e.target.value)])
                                }
                                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                            />
                        </div>
                    </div>
                );
            }

            case "vec3": {
                if (input.nativeType === "vec3" && !input.type.includes("color")) {
                    const [x, y, z] = Array.isArray(value) ? value : input.default;
                    return (
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs">X: {x.toFixed(2)}</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={x}
                                    onChange={(e) =>
                                        updateValue(input.name, [parseFloat(e.target.value), y, z])
                                    }
                                    className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs">Y: {y.toFixed(2)}</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={y}
                                    onChange={(e) =>
                                        updateValue(input.name, [x, parseFloat(e.target.value), z])
                                    }
                                    className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs">Z: {z.toFixed(2)}</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={z}
                                    onChange={(e) =>
                                        updateValue(input.name, [x, y, parseFloat(e.target.value)])
                                    }
                                    className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                />
                            </div>
                        </div>
                    );
                }
                break;
            }

            case "bool":
            case "int": {
                if (input.type === "bool" || input.nativeType === "int32_t") {
                    const boolValue = typeof value === "boolean" ? value : value === 1;
                    return (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={boolValue}
                                onChange={(e) =>
                                    updateValue(
                                        input.name,
                                        input.type === "int"
                                            ? e.target.checked
                                                ? 1
                                                : 0
                                            : e.target.checked
                                    )
                                }
                                className="w-5 h-5"
                            />
                        </div>
                    );
                }
                break;
            }

            case "texture": {
                const textureId = typeof value === "string" ? value : input.default;
                return (
                    <div>
                        <input
                            type="text"
                            value={textureId}
                            onChange={(e) => updateValue(input.name, e.target.value)}
                            placeholder="Texture UUID"
                            className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {textureId === "0f7983f4-4469-4d66-a355-93253108b311"
                                ? "White texture (default)"
                                : textureId === "e8945da2-23ca-4133-833d-ef063ad6348c"
                                ? "Normal map (default)"
                                : "Custom texture"}
                        </p>
                    </div>
                );
            }

            default:
                return <div className="text-xs text-gray-400">Unsupported type: {input.type}</div>;
        }
    };

    if (entities.length === 0 || !entities[0]?.material) {
        return (
            <div className="bg-red-900/50 text-white p-4 rounded-lg">
                <p>No material found on entities</p>
            </div>
        );
    }

    return (
        <div className="bg-black/80 text-white rounded-lg shadow-lg backdrop-blur-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/20 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Material Editor</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {materialSchema.name} ({entities.length}{" "}
                            {entities.length === 1 ? "entity" : "entities"})
                        </p>
                    </div>
                    {/* Transparency Toggle */}
                    <button
                        onClick={toggleTransparency}
                        className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
                            isTransparent
                                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                        title={isTransparent ? "Switch to Opaque" : "Switch to Transparent"}
                    >
                        {isTransparent ? "Transparent" : "Opaque"}
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/20 flex-wrap shrink-0">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                            activeCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Parameters */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {filteredInputs.length === 0 ? (
                    <p className="text-gray-400 text-sm">No parameters in this category</p>
                ) : (
                    filteredInputs.map((input) => (
                        <div key={input.id} className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <label className="text-sm font-semibold">{input.name}</label>
                                    {materialData[input.name] !== undefined &&
                                        typeof materialData[input.name] === "number" && (
                                            <span className="ml-2 text-xs text-gray-400">
                                                {(materialData[input.name] as number).toFixed(2)}
                                            </span>
                                        )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">{input.description}</p>
                            {renderWidget(input)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
