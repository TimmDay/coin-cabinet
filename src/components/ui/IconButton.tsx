import type { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  iconSize?: "sm" | "md" | "lg";
  variant?: "default" | "large";
  "aria-label": string; // Make aria-label required for accessibility
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon: Icon, iconSize = "md", variant = "default", className, ...props },
    ref,
  ) => {
    const baseClasses =
      "flex items-center justify-center cursor-pointer rounded-full bg-slate-800/50 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white disabled:opacity-50";

    const variantClasses = {
      default: "p-2",
      large: "p-3",
    };

    const iconSizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        <Icon className={iconSizeClasses[iconSize]} />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
