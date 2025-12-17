// Helper function to process text for smart word wrapping
// Replaces spaces with non-breaking spaces between words where one word is 4 characters or less
// Also replaces hyphens with non-breaking hyphens to prevent wrapping on hyphens
export function processTextForSmartWrapping(text: string): string {
  // First, replace hyphens with non-breaking hyphens (‑) to prevent wrapping on hyphens
  const textWithNonBreakingHyphens = text.replace(/-/g, "‑")

  const words = textWithNonBreakingHyphens.split(" ")
  const processedWords: string[] = []

  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i]!
    const nextWord = words[i + 1]

    if (nextWord && (currentWord.length <= 6 || nextWord.length <= 6)) {
      // Use non-breaking space (\u00A0) to prevent wrapping between short words
      processedWords.push(currentWord + "\u00A0" + nextWord)
      i++ // Skip the next word since we've processed it
    } else {
      processedWords.push(currentWord)
    }
  }

  return processedWords.join(" ")
}

// Helper function to detect if text will likely wrap
// Checks if there are multiple words that can wrap (not connected by non-breaking spaces)
export function willTextWrap(text: string): boolean {
  const processedText = processTextForSmartWrapping(text)
  // Count spaces (not non-breaking spaces) - if there are normal spaces, text can wrap
  return processedText.includes(" ") && processedText.split(" ").length > 1
}