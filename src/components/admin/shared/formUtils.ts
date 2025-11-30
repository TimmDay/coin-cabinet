/**
 * Common utility functions for form processing in admin modals
 */

/**
 * Process comma-separated string into array
 * @param str - Comma-separated string
 * @returns Array of trimmed, non-empty strings or empty array
 */
export const processArray = (str: string): string[] =>
  str.trim()
    ? str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []

/**
 * Process comma-separated string into array or null
 * @param str - Comma-separated string
 * @param toLowerCase - Whether to convert to lowercase
 * @returns Array of strings, null if empty
 */
export const processArrayOrNull = (
  str: string,
  toLowerCase = false,
): string[] | null => {
  const arr = processArray(str).map((s) => (toLowerCase ? s.toLowerCase() : s))
  return arr.length > 0 ? arr : null
}

/**
 * Parse JSON string safely
 * @param str - JSON string
 * @returns Parsed data or empty array on error
 */
export const parseJSONSafe = <T = unknown>(str: string): T => {
  try {
    return JSON.parse(str) as T
  } catch {
    return [] as T
  }
}

/**
 * Handle unsaved changes confirmation
 * @param isDirty - Whether form has unsaved changes
 * @param onClose - Close callback
 */
export const handleUnsavedChanges = (isDirty: boolean, onClose: () => void) => {
  if (isDirty) {
    if (confirm("You have unsaved changes. Are you sure you want to close?")) {
      onClose()
    }
  } else {
    onClose()
  }
}
