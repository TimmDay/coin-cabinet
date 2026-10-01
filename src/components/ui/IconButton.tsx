import type { LucideIcon } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "~/lib/utils"

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  iconSize?: "sm" | "md" | "lg"
  /**
   * default and large: a round button on a field surface with a grey edge.
   * ghost: just the icon, muted, for small actions inside a field (clearing it).
   */
  variant?: "default" | "large" | "ghost"
  "aria-label": string // Make aria-label required for accessibility
}

const baseClasses =
  "flex items-center justify-center cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-moonlight/70 focus-visible:outline-none disabled:opacity-50"

const variantClasses = {
  default:
    "p-2 border border-line bg-field/80 text-moonlight-bright hover:bg-line/60",
  large:
    "p-3 border border-line bg-field/80 text-moonlight-bright hover:bg-line/60",
  ghost: "h-8 w-8 text-field-muted hover:text-ink",
}

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

/** A button that is only an icon. type="button" by default. */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      iconSize = "md",
      variant = "default",
      className,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {/* The button's aria-label names it; the icon is decoration */}
      <Icon className={iconSizeClasses[iconSize]} aria-hidden="true" />
    </button>
  ),
)

IconButton.displayName = "IconButton"

export { IconButton }
