type ViewMode = "obverse" | "reverse" | "both";

type ViewModeControlsProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

export function ViewModeControls({
  viewMode,
  onViewModeChange,
}: ViewModeControlsProps) {
  return (
    <div className="mt-6 flex justify-center">
      <div className="flex items-center rounded-full border border-slate-700/30 bg-slate-900/40 p-1 backdrop-blur-sm">
        <label className="group relative z-10 cursor-pointer">
          <input
            type="radio"
            name="viewMode"
            value="obverse"
            checked={viewMode === "obverse"}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="peer sr-only"
          />
          <div
            className={`w-14 rounded-full py-2 text-center text-sm font-medium transition-all duration-200 ${
              viewMode === "obverse"
                ? "bg-slate-700/50 text-slate-500 shadow-sm"
                : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-400"
            }`}
          >
            Obv
          </div>
        </label>

        <label className="group relative z-10 cursor-pointer">
          <input
            type="radio"
            name="viewMode"
            value="reverse"
            checked={viewMode === "reverse"}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="peer sr-only"
          />
          <div
            className={`w-14 rounded-full py-2 text-center text-sm font-medium transition-all duration-200 ${
              viewMode === "reverse"
                ? "bg-slate-700/50 text-slate-500 shadow-sm"
                : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-400"
            }`}
          >
            Rev
          </div>
        </label>

        <label className="group relative z-10 cursor-pointer">
          <input
            type="radio"
            name="viewMode"
            value="both"
            checked={viewMode === "both"}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="peer sr-only"
          />
          <div
            className={`w-14 rounded-full py-2 text-center text-sm font-medium transition-all duration-200 ${
              viewMode === "both"
                ? "bg-slate-700/50 text-slate-500 shadow-sm"
                : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-400"
            }`}
          >
            Both
          </div>
        </label>
      </div>
    </div>
  )
}
