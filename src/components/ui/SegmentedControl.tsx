type SegmentedControlOption<T extends string> = {
  value: T
  label: string
  /** Offered but not choosable, for a choice that makes no sense right now. */
  disabled?: boolean
  /** Explains a disabled option, as a tooltip. */
  title?: string
}

type SegmentedControlProps<T extends string> = {
  /** Name of the group: read by screen readers, hidden visually */
  legend: string
  /** Radio group name */
  name: string
  /** Share the full width of the column */
  fill?: boolean
  /** "sm" for controls sitting over a map or in a tight row. */
  size?: "sm" | "md"
  options: readonly SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/**
 * A pill of radio buttons. Real radios under the visible labels, so arrow
 * keys, grouping and state work natively; the fieldset names the group, and
 * the focused option gets a visible moonlight ring.
 *
 * The selected option is marked by a brighter label as well as a fill. The
 * fill alone measures 1.48:1 against the pill, under the 3:1 a state
 * indicator wants, but the label carries it too: both states clear 4.5:1 and
 * the selected one reads about twice as bright.
 */
export function SegmentedControl<T extends string>({
  legend,
  name,
  fill = false,
  size = "md",
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  const small = size === "sm"

  return (
    <fieldset
      className={`border-line bg-field flex items-center rounded-full border ${small ? "p-0.5" : "p-1"} ${fill ? "flex-1 md:w-full" : ""} ${className}`}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          title={option.title}
          className={`relative ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"} ${fill ? "flex-1" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <div
            className={`peer-focus-visible:ring-moonlight/70 font-display rounded-full text-center tracking-wide uppercase transition-colors duration-200 peer-focus-visible:ring-2 ${
              small
                ? "px-2.5 py-1 text-[11px]"
                : "px-2 py-2 text-sm md:px-4 md:tracking-widest"
            } ${
              option.disabled
                ? "text-field-muted/40"
                : value === option.value
                  ? "bg-line text-ink"
                  : "text-field-muted hover:bg-line/50 hover:text-ink"
            }`}
          >
            {option.label}
          </div>
        </label>
      ))}
    </fieldset>
  )
}

type ToggleGroupOption<T extends string> = {
  value: T
  label: string
}

type ToggleGroupProps<T extends string> = {
  legend: string
  options: readonly ToggleGroupOption<T>[]
  /** Every option currently on. Order does not matter. */
  value: readonly T[]
  onChange: (value: T[]) => void
  size?: "sm" | "md"
  className?: string
}

/**
 * The same pill, but every option toggles on its own.
 *
 * Checkboxes rather than radios, because these are not alternatives: a reader
 * may want two of them at once. Visually identical to SegmentedControl, so a
 * row of both reads as one set of controls.
 */
export function ToggleGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  size = "md",
  className = "",
}: ToggleGroupProps<T>) {
  const small = size === "sm"

  return (
    <fieldset
      className={`border-line bg-field flex items-center rounded-full border ${small ? "p-0.5" : "p-1"} ${className}`}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const on = value.includes(option.value)

        return (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="checkbox"
              checked={on}
              onChange={() =>
                onChange(
                  on
                    ? value.filter((held) => held !== option.value)
                    : [...value, option.value],
                )
              }
              className="peer sr-only"
            />
            <div
              className={`peer-focus-visible:ring-moonlight/70 font-display rounded-full text-center tracking-wide uppercase transition-colors duration-200 peer-focus-visible:ring-2 ${
                small
                  ? "px-2.5 py-1 text-[11px]"
                  : "px-2 py-2 text-sm md:px-4 md:tracking-widest"
              } ${
                on
                  ? "bg-line text-ink"
                  : "text-field-muted hover:bg-line/50 hover:text-ink"
              }`}
            >
              {option.label}
            </div>
          </label>
        )
      })}
    </fieldset>
  )
}
