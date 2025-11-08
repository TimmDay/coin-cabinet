type PageTitleProps = {
  /** The main text of the title */
  children: string
  /** Optional subtitle text */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
  /** Use purple accent instead of gold for auth pages */
  authPage?: boolean
}

export function PageTitle({
  children,
  subtitle,
  className = "",
  authPage = false,
}: PageTitleProps) {
  // Split the title into words and identify the last word for accent
  const words = children.trim().split(" ")
  const lastWordIndex = words.length - 1

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <h1 className="text-3xl font-light tracking-wide text-slate-300 sm:text-4xl lg:text-5xl">
        {words.map((word, index) => {
          if (index === lastWordIndex) {
            return (
              <span
                key={index}
                className={authPage ? "text-purple-400" : "heading-accent"}
              >
                {word}
              </span>
            )
          }
          return (
            <span key={index}>
              {word}
              {index < lastWordIndex ? " " : ""}
            </span>
          )
        })}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-center text-lg text-slate-400 md:mt-4">
          {subtitle}
        </p>
      )}

      {/* Underline border - 300px wide */}
      <div className="mt-5 h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent md:mt-7"></div>
    </div>
  )
}
