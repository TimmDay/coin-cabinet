type ViewMode = "obverse" | "reverse" | "both"
type ClickMode = "browse" | "dive"

type ViewModeControlsProps = {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  clickMode?: ClickMode
  onClickModeChange?: (mode: ClickMode) => void
}

type SegmentedControlProps<T extends string> = {
  /** Name of the group: read by screen readers, hidden visually */
  legend: string
  /** Radio group name */
  name: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/**
 * A pill of radio buttons. Real radios under the visible labels, so arrow
 * keys, grouping and state work natively; the fieldset names the group, and
 * the focused option gets a visible moonlight ring.
 */
function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className="border-line bg-field flex items-center rounded-full border p-1">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="relative cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <div
            className={`peer-focus-visible:ring-moonlight/70 font-display rounded-full px-4 py-2 text-center text-sm tracking-widest uppercase transition-colors duration-200 peer-focus-visible:ring-2 ${
              value === option.value
                ? "bg-line text-ink"
                : "text-moonlight hover:bg-line/50 hover:text-ink"
            }`}
          >
            {option.label}
          </div>
        </label>
      ))}
    </fieldset>
  )
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
  viewMode,
  onViewModeChange,
  clickMode = "dive",
  onClickModeChange,
}: ViewModeControlsProps) {
  return (
    <div className="z-controls mt-6 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SegmentedControl
          legend="Coin side to show"
          name="viewMode"
          options={VIEW_MODE_OPTIONS}
          value={viewMode}
          onChange={onViewModeChange}
        />

        {onClickModeChange && (
          <SegmentedControl
            legend="What clicking a coin does"
            name="clickMode"
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
