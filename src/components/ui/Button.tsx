import { forwardRef } from "react"
import { cn } from "~/lib/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * The site's text button: Cinzel capitals on a field surface with a grey
 * edge, a moonlight focus ring, and a brighter edge on hover. It defaults to
 * type="button" so it never submits a form by accident.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "font-display border-line bg-field text-moonlight-bright hover:border-moonlight/50 hover:bg-line/50 focus-visible:ring-moonlight/70 cursor-pointer rounded-md border px-6 py-2 text-sm font-medium tracking-widest uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = "Button"

export { Button }
