"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "outline"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
}

const variants = {
  primary:
    "bg-purple-700 text-white opacity-75 transition-all hover:bg-purple-600 hover:opacity-100",
  secondary:
    "bg-gray-600 text-white opacity-75 transition-all hover:bg-gray-500 hover:opacity-100",
  outline:
    "border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? (false || isLoading)

  return (
    <button
      disabled={isDisabled}
      className={`cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className} `}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}
