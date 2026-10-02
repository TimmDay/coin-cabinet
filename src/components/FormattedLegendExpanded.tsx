export function FormattedLegendExpanded({ text }: { text: string }) {
  // Split the text by parentheses while keeping the delimiters
  const parts = text.split(/(\([^)]*\))/)
  const parenthesesRegex = /^\([^)]*\)$/

  return (
    <span>
      {parts.map((part, index) => {
        if (parenthesesRegex.exec(part)) {
          // This is text within parentheses - remove the parentheses and set it smaller, in lowercase
          const innerText = part.slice(1, -1) // Remove the parentheses
          return (
            <span key={index} className="text-[0.65em] font-normal lowercase">
              {innerText}
            </span>
          )
        } else {
          // Regular text is uppercase at the size of the surrounding legend
          return (
            <span key={index} className="font-normal uppercase">
              {part}
            </span>
          )
        }
      })}
    </span>
  )
}
