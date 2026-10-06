import { SegmentedControl } from "./SegmentedControl"

type ViewMode = "obverse" | "reverse" | "both"
type ClickMode = "browse" | "dive"

type ViewModeControlsProps = {
  /**
   * Line the toggles up with the filters under them (the coin grid). The
   * pills always share the full width of the filters column, side by side
   * (they wrap only when the screen is too narrow for both). From tablet (md)
   * up they become two equal columns whose gap lines up with a gap in a row
   * of four equal cells.
   */
  fill?: boolean
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  clickMode?: ClickMode
  onClickModeChange?: (mode: ClickMode) => void
}

const VIEW_MODE_OPTIONS = [
  { value: "obverse", label: "Obv" },
  { value: "reverse", label: "Rev" },
  { value: "both", label: "Both" },
] as const

const CLICK_MODE_OPTIONS = [
  { value: "browse", label: "Browse" },
  { value: "dive", label: "Dive" },
] as const

export function ViewModeControls({
  fill = false,
  viewMode,
  onViewModeChange,
  clickMode = "dive",
  onClickModeChange,
}: ViewModeControlsProps) {
  return (
    <div
      className={`z-controls mt-6 flex justify-center ${fill ? "w-80 max-w-full md:w-[40rem]" : ""}`}
    >
      <div
        className={`flex flex-wrap items-center justify-center gap-2 ${
          fill ? "w-full md:grid md:grid-cols-2" : "sm:gap-4"
        }`}
      >
        <SegmentedControl
          legend="Coin side to show"
          name="viewMode"
          fill={fill}
          options={VIEW_MODE_OPTIONS}
          value={viewMode}
          onChange={onViewModeChange}
        />

        {onClickModeChange && (
          <SegmentedControl
            legend="What clicking a coin does"
            name="clickMode"
            fill={fill}
            options={CLICK_MODE_OPTIONS}
            value={clickMode}
            onChange={onClickModeChange}
          />
        )}
      </div>
    </div>
  )
}

export type { ViewMode, ClickMode }
