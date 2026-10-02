import { useId } from "react"

/**
 * A small circular button that reveals a legend's translation. Same blueprint
 * outline as the clock buttons, about half the size. Place it inline at the end
 * of the legend, inside a `relative` parent: the tooltip centres on that parent
 * so it stays inside the column.
 */
export function LegendTranslationTip({ translation }: { translation: string }) {
  const tooltipId = useId()

  return (
    <span className="group ml-2 inline-block align-[-0.12em]">
      <button
        type="button"
        aria-label="Show translation"
        aria-describedby={tooltipId}
        className="border-moonlight/70 text-moonlight hover:border-moonlight focus-visible:border-moonlight focus-visible:ring-moonlight/70 block h-[22px] w-[22px] cursor-pointer rounded-full border border-dashed bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
      />
      <span
        id={tooltipId}
        role="tooltip"
        className="border-line bg-field text-moonlight-bright pointer-events-none absolute top-full left-1/2 z-30 mt-2 hidden w-max max-w-xs -translate-x-1/2 rounded-md border px-3 py-2 text-center font-sans text-sm font-normal tracking-normal normal-case group-focus-within:block group-hover:block"
      >
        {translation}
      </span>
    </span>
  )
}
