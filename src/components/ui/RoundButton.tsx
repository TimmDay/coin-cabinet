import React from "react"
import { cn } from "~/lib/utils"

export type RoundButtonProps = {
  /**
   * The content to display inside the button
   */
  children: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Button size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Button color variant
   */
  variant?: "primary" | "secondary" | "danger" | "auth";
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Button type for forms
   */
  type?: "button" | "submit" | "reset";
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

const variantClasses = {
  primary:
    "bg-amber-600 text-slate-900 hover:bg-amber-500 active:bg-amber-700 focus:ring-amber-500",
  secondary:
    "bg-slate-600 text-slate-200 hover:bg-slate-500 active:bg-slate-700 focus:ring-slate-500",
  danger:
    "bg-rose-800/80 text-rose-100 hover:bg-rose-700/80 active:bg-rose-900/80 focus:ring-rose-600",
  auth: "bg-auth-accent text-slate-900 hover:bg-auth-accent/90 active:bg-auth-accent/80 focus:ring-auth-accent",
}

/**
 * A themed round button component with hover and focus states
 */
export const RoundButton: React.FC<RoundButtonProps> = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  disabled = false,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        "rounded-full font-medium transition-all duration-200 ease-in-out",
        "focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:outline-none",
        // Color variant
        variantClasses[variant],
        // Shadow for depth
        "shadow-md hover:shadow-lg",
        // Transform on hover
        "hover:scale-105 active:scale-95",
        // Size variant
        sizeClasses[size],
        // Disabled state
        disabled &&
          "cursor-not-allowed opacity-50 hover:scale-100 hover:shadow-md",
        className,
      )}
    >
      {children}
    </button>
  )
}
