import { useState } from "react";
import { getAllCategories, getPresetsByCategory } from "./MaterialPresets";

interface PresetPanelProps {
    onApplyPreset: (presetName: string) => void;
}

export function PresetPanel({ onApplyPreset }: PresetPanelProps) {
    const [activeCategory, setActiveCategory] = useState<string>("Metals");

    return (
        <div className="bg-black/80 text-white rounded-lg shadow-lg backdrop-blur-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/20 shrink-0">
                <h2 className="text-lg font-bold">Material Presets</h2>
                <p className="text-xs text-gray-400 mt-1">Quick material templates</p>
            </div>

            {/* Preset Category Tabs */}
            <div className="flex gap-1 p-4 border-b border-white/20 flex-wrap shrink-0">
                {getAllCategories().map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            activeCategory === cat
                                ? "bg-purple-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Preset Buttons */}
            <div className="p-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-2">
                    {getPresetsByCategory(activeCategory).map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => onApplyPreset(preset.name)}
                            className="bg-gray-700 hover:bg-gray-600 px-3 py-2.5 rounded text-sm transition-colors text-left group"
                        >
                            <div className="font-semibold group-hover:text-purple-400 transition-colors">
                                {preset.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{preset.description}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
