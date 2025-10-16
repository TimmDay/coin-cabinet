export function FormattedLegendExpanded({ text }: { text: string }) {
  // Split the text by parentheses while keeping the delimiters
  const parts = text.split(/(\([^)]*\))/)
  const parenthesesRegex = /^\([^)]*\)$/

  return (
    <span>
      {parts.map((part, index) => {
        if (parenthesesRegex.exec(part)) {
          // This is text within parentheses - remove the parentheses and apply special formatting
          const innerText = part.slice(1, -1) // Remove the parentheses
          return (
            <span key={index} className="font-normal lowercase">
              {innerText}
            </span>
          )
        } else {
          // This is regular text - apply normal formatting (uppercase, bold)
          return (
            <span key={index} className="font-bold uppercase">
              {part}
            </span>
          )
        }
      })}
    </span>
  )
}
