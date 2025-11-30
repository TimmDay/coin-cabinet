import { z } from "zod"

// Place kind options
export const placeKindOptions = [
  { value: "city", label: "City" },
  { value: "temple", label: "Temple" },
  { value: "ruin", label: "Ruin" },
  { value: "museum", label: "Museum" },
  { value: "other", label: "Other" },
] as const

// Form input schema (strings that will be transformed)
export const placeFormInputSchema = z.object({
  // Basic identification
  name: z
    .string()
    .min(1, "Place name is required")
    .max(255, "Name is too long"),
  alt_names: z.string().optional(),
  kind: z.enum(["city", "temple", "ruin", "museum", "other"], {
    required_error: "Place kind is required",
  }),

  // Location
  lat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  // Details
  location_description: z.string().optional(),
  established_year: z
    .number()
    .int()
    .min(-3000, "Year too early")
    .max(2100, "Year too late")
    .optional()
    .nullable(),
  flavour_text: z.string().optional(),
  historical_sources: z.string().optional(),
  host_to: z.string().optional(), // comma-separated string
  artifact_ids: z.string().optional(), // comma-separated string
})

// Processed schema (for API)
export const placeFormSchema = placeFormInputSchema.transform((data) => ({
  ...data,
  alt_names: data.alt_names
    ? data.alt_names
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    : [],
  location_description: data.location_description?.trim() ?? undefined,
  flavour_text: data.flavour_text?.trim() ?? undefined,
  historical_sources: data.historical_sources?.trim() ?? undefined,
  host_to: data.host_to
    ? data.host_to
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [],
  artifact_ids: data.artifact_ids
    ? data.artifact_ids
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [],
}))

export type PlaceFormInputData = z.infer<typeof placeFormInputSchema>
export type PlaceFormData = z.infer<typeof placeFormSchema>
