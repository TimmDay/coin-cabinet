"use client";

import { Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type InfoTooltipProps = {
  content: string;
  id?: string;
};

export function InfoTooltip({
  content,
  id = "info-tooltip",
}: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipToggle = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  // Calculate tooltip position when showing
  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Position tooltip above the button, centered horizontally
      const x = rect.left + scrollX + rect.width / 2;
      const y = rect.top + scrollY - 8; // 8px gap above button

      setTooltipPosition({ x, y });
    }
  }, [showTooltip]);

  // Handle clicks outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTooltip &&
        buttonRef.current &&
        tooltipRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <>
      <button
        ref={buttonRef}
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

      {/* Tooltip Content - Rendered in Portal */}
      {showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            className="fixed z-50 max-w-md min-w-64 rounded-lg border border-slate-600/50 bg-slate-800/95 p-4 text-sm text-slate-300 shadow-lg backdrop-blur-sm sm:max-w-lg lg:max-w-xl xl:max-w-2xl"
            style={
              {
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: "translate(-50%, -100%)",
              } as React.CSSProperties
            }
            tabIndex={-1}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="whitespace-pre-line">{content}</div>
          </div>,
          document.body,
        )}
    </>
  );
}
