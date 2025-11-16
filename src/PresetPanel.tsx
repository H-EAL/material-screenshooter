import { useState } from "react";
import { getAllCategories, getPresetsByCategory } from "./MaterialPresets";

interface PresetPanelProps {
    onApplyPreset: (presetName: string) => void;
}

export function PresetPanel({ onApplyPreset }: PresetPanelProps) {
    const [activeCategory, setActiveCategory] = useState<string>("Metals");

    return (
        <div className="bg-black/90 text-white rounded-xl shadow-2xl backdrop-blur-sm h-full flex flex-col overflow-hidden border border-white/10">
            <div className="p-5 border-b border-white/10 shrink-0">
                <h2 className="text-xl font-bold">Material Presets</h2>
                <p className="text-xs text-gray-400 mt-1">Quick material templates</p>
            </div>

            {/* Preset Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/10 flex-wrap shrink-0">
                {getAllCategories().map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeCategory === cat
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Preset Buttons */}
            <div className="p-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-3">
                    {getPresetsByCategory(activeCategory).map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => onApplyPreset(preset.name)}
                            className="bg-gray-800/80 hover:bg-gray-700 px-4 py-3 rounded-lg text-sm transition-all text-left group hover:shadow-lg hover:scale-[1.02] border border-white/5"
                        >
                            <div className="font-semibold group-hover:text-purple-400 transition-colors">
                                {preset.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{preset.description}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
