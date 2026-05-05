import { z } from "zod"
import { csvStringField, optionalStringField } from "~/lib/types/form-patterns"

export const deviceFormInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  translation: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  sources: z.string().optional(),
  artifact_ids: z.string().optional(),
  img: z.string().optional(),
})

export const deviceFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  translation: optionalStringField,
  description: z.string().min(1, "Description is required"),
  category: optionalStringField,
  sources: csvStringField,
  artifact_ids: csvStringField,
  img: optionalStringField,
})

export type DeviceFormInputData = z.infer<typeof deviceFormInputSchema>
export type DeviceFormData = z.infer<typeof deviceFormSchema>
