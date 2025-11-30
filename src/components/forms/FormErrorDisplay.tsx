import type { FieldErrors } from "react-hook-form"

type FormErrorDisplayProps = {
  errors: FieldErrors
}

export function FormErrorDisplay({ errors }: FormErrorDisplayProps) {
  if (!errors.root) return null

  return (
    <div className="rounded-md bg-red-50 p-4">
      <p className="text-sm text-red-800">{errors.root.message}</p>
    </div>
  )
}
