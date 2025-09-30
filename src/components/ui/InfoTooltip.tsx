"use client";

import { Info } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type InfoTooltipProps = {
  content: string;
  id?: string;
};

export function InfoTooltip({
  content,
  id = "info-tooltip",
}: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipToggle = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleTooltipToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onBlur={(e) => {
          // Only hide tooltip if focus is not moving to the tooltip content
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setShowTooltip(false);
          }
        }}
        className="cursor-pointer rounded-full border border-slate-600/50 bg-slate-700/50 p-2 text-slate-300 transition-all duration-200 hover:border-slate-500/50 hover:bg-slate-600/50 hover:text-slate-200"
        aria-label="Show additional information"
        aria-expanded={showTooltip}
        aria-describedby={id}
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Tooltip Content */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-600/50 bg-slate-800/95 p-3 text-sm text-slate-300 shadow-lg backdrop-blur-sm"
          tabIndex={-1}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="whitespace-pre-line">{content}</div>
        </div>
      )}
    </div>
  );
}
