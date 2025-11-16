import { environmentPresets, type EnvironmentPreset } from "./EnvironmentPresets";

interface EnvironmentSelectorProps {
    onApplyEnvironment: (preset: EnvironmentPreset) => void;
}

export function EnvironmentSelector({ onApplyEnvironment }: EnvironmentSelectorProps) {
    return (
        <div className="bg-black/90 text-white rounded-xl shadow-2xl backdrop-blur-sm h-full flex flex-col overflow-hidden border border-white/10">
            <div className="p-5 border-b border-white/10 shrink-0">
                <h2 className="text-xl font-bold">Environment</h2>
                <p className="text-xs text-gray-400 mt-1">HDR lighting presets</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {environmentPresets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => onApplyEnvironment(preset)}
                        className="w-full text-left bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] border border-white/5 group"
                    >
                        <div className="font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                            {preset.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{preset.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
