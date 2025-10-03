type PageTitleProps = {
  /** The main text of the title */
  children: string;
  /** Additional CSS classes */
  className?: string;
  /** Use purple accent instead of gold for auth pages */
  authPage?: boolean;
};

export function PageTitle({
  children,
  className = "",
  authPage = false,
}: PageTitleProps) {
  // Split the title into words and identify the last word for accent
  const words = children.trim().split(" ");
  const lastWordIndex = words.length - 1;

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
            );
          }
          return (
            <span key={index}>
              {word}
              {index < lastWordIndex ? " " : ""}
            </span>
          );
        })}
      </h1>

      {/* Underline border - 300px wide */}
      <div className="mt-9 h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </div>
  );
}
