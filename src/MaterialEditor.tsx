import { useState, useEffect, useCallback } from "react";
import materialSchema from "./assets/pbr_material_shader.schema.json";
import { materialPresets } from "./MaterialPresets";

interface TextureAsset {
    asset_id: string;
    name: string;
}

interface MaterialEditorProps {
    entities: Array<{
        material?: {
            dataJSON: Record<string, unknown>;
            constantsJSON?: Record<string, unknown>;
            shaderRef?: string;
        };
    }>;
    presetToApply?: string;
    availableTextures?: TextureAsset[];
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

interface ConstantDescriptor {
    name: string;
    displayName: string;
    description: string;
    default: boolean;
    type: string;
}

// Filterable Texture Selector Component
function TextureSelector({
    textureId,
    availableTextures,
    onSelectTexture,
}: {
    textureId: string;
    availableTextures: TextureAsset[];
    onSelectTexture: (id: string) => void;
}) {
    const [filterText, setFilterText] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter textures based on search text
    const filteredTextures = availableTextures.filter((texture) =>
        texture.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Get the selected texture name for display
    const selectedTexture = availableTextures.find((t) => t.asset_id === textureId);
    const displayName =
        textureId === "0f7983f4-4469-4d66-a355-93253108b311"
            ? "White (default)"
            : textureId === "e8945da2-23ca-4133-833d-ef063ad6348c"
            ? "Normal (default)"
            : selectedTexture?.name || textureId || "-- Select Texture --";

    return (
        <div className="relative">
            {/* Search Input */}
            <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={`Filter textures... (${displayName})`}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-cyan-500 focus:outline-none"
            />

            {/* Dropdown List */}
            {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded max-h-60 overflow-y-auto shadow-lg">
                    <div
                        className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm"
                        onClick={() => {
                            onSelectTexture("");
                            setIsDropdownOpen(false);
                            setFilterText("");
                        }}
                    >
                        -- Select Texture --
                    </div>
                    <div
                        className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm"
                        onClick={() => {
                            onSelectTexture("0f7983f4-4469-4d66-a355-93253108b311");
                            setIsDropdownOpen(false);
                            setFilterText("");
                        }}
                    >
                        White (default)
                    </div>
                    <div
                        className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm"
                        onClick={() => {
                            onSelectTexture("e8945da2-23ca-4133-833d-ef063ad6348c");
                            setIsDropdownOpen(false);
                            setFilterText("");
                        }}
                    >
                        Normal (default)
                    </div>
                    <div className="border-t border-gray-700"></div>
                    {filteredTextures.length === 0 ? (
                        <div className="px-2 py-2 text-sm text-gray-400 italic">
                            No textures match "{filterText}"
                        </div>
                    ) : (
                        filteredTextures.map((texture) => (
                            <div
                                key={texture.asset_id}
                                className={`px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm ${
                                    texture.asset_id === textureId ? "bg-gray-700" : ""
                                }`}
                                onClick={() => {
                                    onSelectTexture(texture.asset_id);
                                    setIsDropdownOpen(false);
                                    setFilterText("");
                                }}
                            >
                                {texture.name}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setFilterText("");
                    }}
                ></div>
            )}

            <p className="text-xs text-gray-400 mt-1">{availableTextures.length} textures loaded</p>
        </div>
    );
}

export function MaterialEditor({
    entities,
    presetToApply,
    availableTextures = [],
}: MaterialEditorProps) {
    const [materialData, setMaterialData] = useState<Record<string, unknown>>({});
    const [constants, setConstants] = useState<Record<string, boolean>>({});
    const [activeCategory, setActiveCategory] = useState<string>("Base");
    const [isTransparent, setIsTransparent] = useState(false);

    // Shader UUIDs
    const OPAQUE_SHADER = "f2a549e5-4f72-4cef-a5ab-48873c209e0c";
    const TRANSPARENT_SHADER = "a740058e-27a0-48e3-af37-70ae93cc0b67";

    // Initialize material data and constants from first entity
    useEffect(() => {
        if (entities.length === 0 || !entities[0]?.material?.dataJSON) return;

        const firstEntityMaterial = entities[0].material;
        const data: Record<string, unknown> = {};
        (materialSchema.inputDescriptor as InputDescriptor[]).forEach((input) => {
            const value = firstEntityMaterial.dataJSON[input.name];
            data[input.name] = value !== undefined ? value : input.default;
        });
        setMaterialData(data);

        // Initialize constants
        const constantsData: Record<string, boolean> = {};
        (materialSchema.constantDescriptor as ConstantDescriptor[]).forEach((constant) => {
            const value = firstEntityMaterial.constantsJSON?.[constant.name];
            constantsData[constant.name] = typeof value === "boolean" ? value : constant.default;
        });
        setConstants(constantsData);

        // Check if material is transparent
        const shaderRef = firstEntityMaterial?.shaderRef;
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

    // Update all entities' constants when constants change
    useEffect(() => {
        if (entities.length === 0) return;

        entities.forEach((entity) => {
            if (!entity?.material) return;
            if (!entity.material.constantsJSON) {
                entity.material.constantsJSON = {};
            }
            Object.entries(constants).forEach(([key, value]) => {
                entity.material!.constantsJSON![key] = value;
            });
        });
    }, [constants, entities]);

    const updateValue = (name: string, value: unknown) => {
        setMaterialData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleConstant = (name: string) => {
        setConstants((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const toggleTransparency = () => {
        if (entities.length === 0) return;

        const newTransparent = !isTransparent;
        setIsTransparent(newTransparent);

        // Update MATERIAL_TRANSPARENT constant
        setConstants((prev) => ({ ...prev, MATERIAL_TRANSPARENT: newTransparent }));

        entities.forEach((entity) => {
            if (!entity?.material) return;
            entity.material.shaderRef = newTransparent ? TRANSPARENT_SHADER : OPAQUE_SHADER;
        });
    };

    const applyPreset = useCallback(
        (presetName: string) => {
            const preset = materialPresets.find((p) => p.name === presetName);
            if (!preset) return;

            console.log("Applying preset:", presetName, "constants:", preset.constants);

            // Reset ALL properties to their default values first
            const newData: Record<string, unknown> = {};
            (materialSchema.inputDescriptor as InputDescriptor[]).forEach((input) => {
                newData[input.name] = input.default;
            });

            // Then apply preset properties (overriding defaults)
            Object.entries(preset.properties).forEach(([key, value]) => {
                newData[key] = value;
            });

            setMaterialData(newData);

            // Apply constants from preset - always reset all constants
            const newConstants: Record<string, boolean> = {};
            (materialSchema.constantDescriptor as ConstantDescriptor[]).forEach((constant) => {
                // Set to preset value if defined, otherwise false
                newConstants[constant.name] =
                    preset.constants?.[constant.name as keyof typeof preset.constants] ?? false;
            });

            console.log("Setting new constants:", newConstants);
            setConstants(newConstants);

            // Update transparency state and shader based on MATERIAL_TRANSPARENT constant
            const shouldBeTransparent = newConstants.MATERIAL_TRANSPARENT ?? false;
            setIsTransparent(shouldBeTransparent);
            entities.forEach((entity) => {
                if (!entity?.material) return;
                entity.material.shaderRef = shouldBeTransparent
                    ? TRANSPARENT_SHADER
                    : OPAQUE_SHADER;
            });
        },
        [entities, TRANSPARENT_SHADER, OPAQUE_SHADER]
    );

    // Apply preset when presetToApply prop changes
    useEffect(() => {
        if (presetToApply) {
            applyPreset(presetToApply);
        }
    }, [presetToApply, applyPreset]);

    // Check if parameter should be shown based on spec conditions
    const shouldShowParameter = (input: InputDescriptor): boolean => {
        const spec = input.properties?.spec;
        if (!spec) return true;

        // Check all spec conditions against current constants
        return Object.entries(spec).every(([constantName, requiredValue]) => {
            const currentValue = constants[constantName];
            return currentValue === requiredValue;
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
                const numValue =
                    typeof value === "number"
                        ? value
                        : typeof input.default === "number"
                        ? input.default
                        : 0;
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
                const defaultVec2 = Array.isArray(input.default) ? input.default : [0, 0];
                const [x, y] = Array.isArray(value) ? value : defaultVec2;
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
                    const defaultVec3 = Array.isArray(input.default) ? input.default : [0, 0, 0];
                    const [x, y, z] = Array.isArray(value) ? value : defaultVec3;
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
                const textureId =
                    typeof value === "string"
                        ? value
                        : typeof input.default === "string"
                        ? input.default
                        : "";

                // If textures are available, show filterable dropdown, otherwise show text input
                if (availableTextures.length > 0) {
                    return (
                        <TextureSelector
                            textureId={textureId}
                            availableTextures={availableTextures}
                            onSelectTexture={(id) => updateValue(input.name, id)}
                        />
                    );
                }

                // Fallback to text input if no textures loaded
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
        <div className="bg-black/90 text-white rounded-xl shadow-2xl backdrop-blur-sm h-full flex flex-col overflow-hidden border border-white/10">
            <div className="p-5 border-b border-white/10 shrink-0">
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
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            isTransparent
                                ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/50"
                                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        }`}
                        title={isTransparent ? "Switch to Opaque" : "Switch to Transparent"}
                    >
                        {isTransparent ? "💎 Transparent" : "⚫ Opaque"}
                    </button>
                </div>
            </div>

            {/* Feature Flags */}
            <div className="p-4 border-b border-white/10 shrink-0">
                <details className="group">
                    <summary className="text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors flex items-center justify-between">
                        <span>Material Features</span>
                        <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                            ▶
                        </span>
                    </summary>
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                        {(materialSchema.constantDescriptor as ConstantDescriptor[]).map(
                            (constant) => (
                                <button
                                    key={constant.name}
                                    onClick={() => toggleConstant(constant.name)}
                                    className={`px-2 py-1.5 rounded text-[10px] transition-all text-center font-medium ${
                                        constants[constant.name]
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                                    }`}
                                    title={`${constant.displayName}: ${constant.description}`}
                                >
                                    {constant.displayName
                                        .replace("Material ", "")
                                        .replace("Vertex ", "")}
                                </button>
                            )
                        )}
                    </div>
                </details>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/10 flex-wrap shrink-0">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeCategory === category
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Parameters */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
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
