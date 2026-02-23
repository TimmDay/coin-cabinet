import { z } from "zod"

// Raw form input type that matches what the API expects before Zod transformation
export type DeityFormInput = {
  name: string
  subtitle: string
  flavour_text: string
  secondary_info: string
  alt_names: string
  similar_gods: string
  god_of: string
  features_coinage: string
  legends_coinage: string
  historical_sources: string
  place_ids: string[]
  festivals: string
  artifact_ids: string[] | string
}

// Schema that properly handles database column types
export const deityFormSchema = z.object({
  // Basic identification
  name: z
    .string()
    .min(1, "Deity name is required")
    .max(255, "Name is too long"),

  // String fields - match Deity type exactly
  subtitle: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  flavour_text: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  secondary_info: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  // Array fields (text[] columns) - transform CSV strings to arrays
  alt_names: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }),
  similar_gods: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }),
  historical_sources: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }),
  god_of: z
    .string()
    .min(1, "At least one domain is required")
    .transform((val) => {
      return val
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    }),
  legends_coinage: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
    }),

  // JSONB fields - parse JSON or return empty array
  features_coinage: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }),
  festivals: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }),

  // Integer array fields
  place_ids: z
    .array(z.string())
    .optional()
    .default([])
    .transform((ids) =>
      ids.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id)),
    ),
  artifact_ids: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => {
        if (!val || val === "") return []
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }),
    ])
    .optional()
    .default([]),
})

export type DeityFormData = z.infer<typeof deityFormSchema>
