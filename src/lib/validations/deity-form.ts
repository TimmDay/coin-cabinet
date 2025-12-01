import { z } from "zod"

// Schema for individual coinage features
const coinageFeatureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  alt_names: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

// Form input schema (strings that will be transformed)
export const deityFormInputSchema = z.object({
  // Basic identification
  name: z
    .string()
    .min(1, "Deity name is required")
    .max(255, "Name is too long"),
  subtitle: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().max(100, "Subtitle is too long").optional()),
  alt_names: z.string().optional(),
  similar_gods: z.string().optional(),

  // Descriptive information
  flavour_text: z.string().optional(),
  secondary_info: z.string().optional(),
  historical_sources: z.string().optional(),
  god_of: z.string().min(1, "At least one domain is required"),

  // Numismatic information (coin-specific data)
  features_coinage: z
    .string()
    .min(1, "At least one coinage feature is required"),
  legends_coinage: z.string().min(1, "At least one legend is required"),

  // Religious information
  place_ids: z.array(z.string()).optional(),
  festivals: z.string().optional(),

  // Future relationships
  artifact_ids: z.string().optional(),
})

// Processed schema (for API)
export const deityFormSchema = z.object({
  // Basic identification
  name: z
    .string()
    .min(1, "Deity name is required")
    .max(255, "Name is too long"),
  subtitle: z.string().optional(),
  alt_names: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace
      return val
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),
  similar_gods: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace
      return val
        .split(",")
        .map((god) => god.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),

  // Descriptive information
  flavour_text: z.string().optional(),
  secondary_info: z.string().optional(),
  historical_sources: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace
      return val
        .split(",")
        .map((source) => source.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),
  god_of: z
    .string()
    .min(1, "At least one domain is required")
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace
      return val
        .split(",")
        .map((domain) => domain.trim().toLowerCase())
        .filter(Boolean)
    })
    .pipe(z.array(z.string()).min(1, "At least one domain is required")),

  // Numismatic information (coin-specific data)
  features_coinage: z
    .string()
    .min(1, "At least one coinage feature is required")
    .transform((val) => {
      if (!val || val === "") return []
      try {
        // Try to parse as JSON first (for structured input)
        const parsed = JSON.parse(val) as unknown
        if (Array.isArray(parsed)) {
          return parsed as Record<string, unknown>[]
        }
        // If it's not an array, treat as single feature
        return [parsed as Record<string, unknown>]
      } catch {
        // If JSON parsing fails, treat as comma-separated simple features
        return val
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean)
          .map((name) => ({ name, alt_names: [], notes: undefined }))
      }
    })
    .pipe(
      z
        .array(coinageFeatureSchema)
        .min(1, "At least one coinage feature is required"),
    ),
  legends_coinage: z
    .string()
    .min(1, "At least one legend is required")
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace, convert to uppercase
      return val
        .split(",")
        .map((legend) => legend.trim().toUpperCase())
        .filter(Boolean)
    })
    .pipe(z.array(z.string()).min(1, "At least one legend is required")),

  // Religious information
  place_ids: z
    .array(z.string())
    .optional()
    .default([])
    .transform((ids) => ids.map((id) => parseInt(id, 10))),
  festivals: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      try {
        // Parse JSON string from FestivalsEditor
        const parsed = JSON.parse(val) as Array<{
          name: string
          date?: string
          note?: string
        }>
        return parsed
      } catch {
        // If JSON parsing fails, treat as comma-separated simple festival names
        return val
          .split(",")
          .map((festival) => festival.trim())
          .filter(Boolean)
          .map((name) => ({ name, date: undefined, note: undefined }))
      }
    })
    .pipe(
      z.array(
        z.object({
          name: z.string(),
          date: z.string().optional(),
          note: z.string().optional(),
        }),
      ),
    ),

  // Future relationships
  artifact_ids: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      // Split by comma and clean up whitespace
      return val
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),
})

export type DeityFormInputData = z.infer<typeof deityFormInputSchema>
export type DeityFormData = z.infer<typeof deityFormSchema>

// Helper function to transform form input to API data
export function transformDeityFormInput(
  input: DeityFormInputData,
): DeityFormData {
  return {
    name: input.name,
    subtitle: input.subtitle,
    alt_names: input.alt_names
      ? input.alt_names
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : [],
    similar_gods: input.similar_gods
      ? input.similar_gods
          .split(",")
          .map((god) => god.trim())
          .filter(Boolean)
      : [],
    flavour_text: input.flavour_text ?? undefined,
    historical_sources: input.historical_sources
      ? input.historical_sources
          .split(",")
          .map((source) => source.trim())
          .filter(Boolean)
      : [],
    god_of: input.god_of
      .split(",")
      .map((domain) => domain.trim().toLowerCase())
      .filter(Boolean),
    features_coinage: (() => {
      try {
        // Try to parse as JSON first (for structured input)
        const parsed = JSON.parse(input.features_coinage) as unknown
        if (Array.isArray(parsed)) {
          return parsed as {
            name: string
            alt_names?: string[]
            notes?: string
          }[]
        }
        // If it's not an array, treat as single feature
        return [
          parsed as { name: string; alt_names?: string[]; notes?: string },
        ]
      } catch {
        // If JSON parsing fails, treat as comma-separated simple features
        return input.features_coinage
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean)
          .map((name) => ({ name, alt_names: [], notes: undefined }))
      }
    })(),
    legends_coinage: input.legends_coinage
      .split(",")
      .map((legend) => legend.trim().toUpperCase())
      .filter(Boolean),
    place_ids: (input.place_ids ?? []).map((id) => parseInt(id, 10)),
    festivals: (() => {
      if (!input.festivals) return []
      try {
        // Try to parse as JSON first (for structured Festival objects)
        const parsed = JSON.parse(input.festivals) as unknown
        if (Array.isArray(parsed)) {
          return parsed as Array<{
            name: string
            date?: string
            note?: string
          }>
        }
        return []
      } catch {
        // If JSON parsing fails, treat as comma-separated simple festival names
        return input.festivals
          .split(",")
          .map((festival) => festival.trim())
          .filter(Boolean)
          .map((name) => ({ name, date: undefined, note: undefined }))
      }
    })(),
    artifact_ids: input.artifact_ids
      ? input.artifact_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [],
  }
}
