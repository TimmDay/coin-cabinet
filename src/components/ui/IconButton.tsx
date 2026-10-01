import type { LucideIcon } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "~/lib/utils"

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  iconSize?: "sm" | "md" | "lg"
  variant?: "default" | "large"
  "aria-label": string // Make aria-label required for accessibility
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon: Icon, iconSize = "md", variant = "default", className, ...props },
    ref,
  ) => {
    const baseClasses =
      "flex items-center justify-center cursor-pointer rounded-full border border-line bg-field/80 text-ink transition-colors hover:bg-line/60 focus-visible:ring-2 focus-visible:ring-moonlight/70 focus-visible:outline-none disabled:opacity-50"

    const variantClasses = {
      default: "p-2",
      large: "p-3",
    }

    const iconSizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        <Icon className={iconSizeClasses[iconSize]} />
      </button>
    )
  },
)

IconButton.displayName = "IconButton"

export { IconButton }
