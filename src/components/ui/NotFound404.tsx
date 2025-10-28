import React from "react"

type NotFound404Props = {
  /** Custom title to display instead of "404" */
  title?: string
  /** Custom message to display instead of "Page not found" */
  message?: string
  /** Additional CSS classes to apply to the container */
  className?: string
  /** Whether to use full screen height (default: true) */
  fullScreen?: boolean
}

/**
 * Generic 404 Not Found component that can be reused throughout the app
 */
export const NotFound404: React.FC<NotFound404Props> = ({
  title = "404",
  message = "Page not found",
  className = "",
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center py-16"

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  )
}
