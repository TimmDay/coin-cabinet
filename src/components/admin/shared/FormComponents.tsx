import type { FieldError, UseFormRegisterReturn } from "react-hook-form"

type FormFieldProps = {
  label: string
  required?: boolean
  placeholder?: string
  error?: FieldError
  children?: React.ReactNode
  className?: string
}

type TextInputProps = FormFieldProps & {
  register: UseFormRegisterReturn
  type?: "text" | "email" | "number"
}

type TextAreaProps = FormFieldProps & {
  register: UseFormRegisterReturn
  rows?: number
}

export function FormField({
  label,
  required = false,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export function TextInput({
  label,
  required = false,
  placeholder,
  error,
  register,
  type = "text",
  className = "",
}: TextInputProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <input
        type={type}
        {...register}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        placeholder={placeholder}
      />
    </FormField>
  )
}

export function TextArea({
  label,
  required = false,
  placeholder,
  error,
  register,
  rows = 3,
  className = "",
}: TextAreaProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <textarea
        {...register}
        rows={rows}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        placeholder={placeholder}
      />
    </FormField>
  )
}
