import { z } from "zod"
import {
  coordinateSchema,
  csvStringField,
  optionalStringField,
  yearSchema,
} from "~/lib/types/form-patterns"

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

  // Location - using standardized coordinate schema
  ...coordinateSchema,

  // Details
  location_description: z.string().optional(),
  established_year: yearSchema,
  flavour_text: z.string().optional(),
  historical_sources: z.string().optional(),
  host_to: z.string().optional(), // comma-separated string
  artifact_ids: z.string().optional(), // comma-separated string
})

// Processed schema (for API) - using standardized field schemas
export const placeFormSchema = z.object({
  // Basic identification
  name: z
    .string()
    .min(1, "Place name is required")
    .max(255, "Name is too long"),
  alt_names: csvStringField,
  kind: z.enum(["city", "temple", "ruin", "museum", "other"], {
    required_error: "Place kind is required",
  }),

  // Location - using standardized coordinate schema
  ...coordinateSchema,

  // Details - using standardized field schemas
  location_description: optionalStringField,
  established_year: yearSchema,
  flavour_text: optionalStringField,
  historical_sources: optionalStringField,
  host_to: csvStringField,
  artifact_ids: csvStringField,
})

export type PlaceFormInputData = z.infer<typeof placeFormInputSchema>
export type PlaceFormData = z.infer<typeof placeFormSchema>
