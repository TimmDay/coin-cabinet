type LoadingProps = {
  /** Custom loading message. Defaults to "Loading..." */
  message?: string
  /** Optional className for the loading text */
  className?: string
  variant?: "admin" | "page" | "component"
}

/**
 * @param variant - Layout variant:
 *   - "admin": Standard admin page layout (default)
 *   - "page": Full-page centered layout for main content pages
 *   - "component": Minimal component-level loading state
 */
export function Loading({
  message = "Loading...",
  className = "coin-description text-xl",
  variant = "admin",
}: LoadingProps) {
  // Component-level loading (for use within existing layouts)
  if (variant === "component") {
    return (
      <div className="py-8 text-center">
        <p className={className}>{message}</p>
      </div>
    )
  }

  // Full-page centered layout (for main content pages)
  if (variant === "page") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <div className="content-wrapper">
          <div className="text-center">
            <p className={className}>{message}</p>
          </div>
        </div>
      </main>
    )
  }

  // Admin page layout (default)
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className={className}>{message}</p>
        </div>
      </div>
    </main>
  )
}
