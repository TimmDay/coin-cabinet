/**
 * Shared form type patterns and utilities to reduce duplication
 * across different entity edit modals and forms
 */
import { z as zod } from "zod"

/**
 * Common modal props pattern for edit modals
 */
export type BaseEditModalProps<T> = {
  isOpen: boolean
  onClose: () => void
  entity: T | null
  onSave: (id: number, updates: Partial<T>) => Promise<void>
  isSaving?: boolean
  mode?: "create" | "edit"
}

/**
 * Common form component props pattern
 */
export type BaseFormProps<TFormData> = {
  onSubmit: (data: TFormData) => Promise<void>
  isLoading: boolean
  submitLabel?: string
}

/**
 * Utility type to convert array fields to string fields for form editing
 * This handles the common pattern where database arrays become comma-separated strings in forms
 */
export type ArrayFieldsToStrings<T> = {
  [K in keyof T]: T[K] extends (string | undefined)[]
    ? string
    : T[K] extends string[]
      ? string
      : T[K]
}

/**
 * Utility type to add "_raw" suffix to fields that need transformation
 * Common pattern for fields that are stored as arrays but edited as strings
 */
export type WithRawFields<T, TRawFields extends keyof T> = Omit<
  T,
  TRawFields
> & {
  [K in TRawFields as `${string & K}_raw`]: string
}

/**
 * Helper for creating form data transformation functions
 */
export function createFormDataTransformer<TEntity, TFormData>(
  transformer: (entity: TEntity | null) => TFormData,
) {
  return transformer
}

/**
 * Helper for creating array-to-string transformations
 */
export function arrayToString(arr: string[] | undefined | null): string {
  return arr?.join(", ") ?? ""
}

/**
 * Helper for creating string-to-array transformations
 */
export function stringToArray(str: string): string[] {
  if (!str || str.trim() === "") return []
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Common Zod transformation for comma-separated strings to arrays
 */
export const stringToArrayTransform = (val: string | undefined) => {
  if (!val || val === "") return []
  return val
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Common Zod transformation for optional strings (handles empty strings)
 */
export const optionalStringTransform = (val: string | undefined) =>
  val === "" || val === undefined ? undefined : val

/**
 * Common coordinate validation schema
 */
export const coordinateSchema = {
  lat: zod
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: zod
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
}

/**
 * Common field schemas for reuse
 */
export const csvStringField = zod
  .string()
  .optional()
  .transform(stringToArrayTransform)
  .pipe(zod.array(zod.string()))

export const optionalCsvStringField = zod
  .string()
  .optional()
  .transform((val) => {
    if (!val || val === "") return undefined
    return stringToArrayTransform(val)
  })
  .pipe(zod.array(zod.string()).optional())

export const requiredStringField = zod.string().min(1, "This field is required")

export const optionalStringField = zod
  .string()
  .optional()
  .transform(optionalStringTransform)
  .pipe(zod.string().optional())

/**
 * Common year validation schema
 */
export const yearSchema = zod
  .number()
  .int()
  .min(-3000, "Year too early")
  .max(2100, "Year too late")
  .optional()
  .nullable()
