import { z } from "zod"

// Form input schema (strings that will be transformed)
export const mintFormInputSchema = z.object({
  // Basic identification
  name: z.string().min(1, "Mint name is required").max(255, "Name is too long"),
  alt_names: z.string().optional(),

  // Location
  lat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  // Mint details
  mint_marks: z.string().optional(),
  flavour_text: z.string().optional(),
  historical_sources: z.string().optional(),
  opened_by: z.string().optional(),
  coinage_materials: z.string().optional(),
  operation_periods: z.string().optional(),
})

// Processed schema (for API)
export const mintFormSchema = z.object({
  // Basic identification
  name: z.string().min(1, "Mint name is required").max(255, "Name is too long"),
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

  // Location
  lat: z.number(),
  lng: z.number(),

  // Mint details
  mint_marks: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((mark) => mark.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),

  flavour_text: z.string().optional(),

  historical_sources: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((source) => source.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),

  opened_by: z.string().optional(),

  coinage_materials: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      return val
        .split(",")
        .map((material) => material.trim())
        .filter(Boolean)
    })
    .pipe(z.array(z.string())),

  operation_periods: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val || val === "") return []
      try {
        const parsed = JSON.parse(val) as unknown
        if (!Array.isArray(parsed)) {
          throw new Error("Must be an array")
        }
        // Validate each tuple
        parsed.forEach((period: unknown, index: number) => {
          if (!Array.isArray(period) || period.length !== 3) {
            throw new Error(`Period ${index + 1} must be a tuple of 3 elements`)
          }
          if (
            typeof period[0] !== "number" ||
            typeof period[1] !== "number" ||
            typeof period[2] !== "string"
          ) {
            throw new Error(
              `Period ${index + 1} must be [number, number, string]`,
            )
          }
        })
        return parsed as Array<[number, number, string]>
      } catch (error) {
        throw new Error(
          error instanceof Error && error.message.includes("Period")
            ? error.message
            : 'Operation periods must be valid JSON like: [[-260, 476, "Republic"], [294, 423, "Diocletian"]]',
        )
      }
    })
    .pipe(z.array(z.tuple([z.number(), z.number(), z.string()]))),
})

export type MintFormInputData = z.infer<typeof mintFormInputSchema>
export type MintFormData = z.infer<typeof mintFormSchema>
