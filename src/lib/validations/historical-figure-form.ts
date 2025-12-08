import { z } from "zod"
import {
  optionalStringField,
  csvStringField,
  optionalCsvStringField,
} from "~/lib/types/form-patterns"

export const historicalSourceSchema = z.object({
  citation: z.string().min(1, "Citation is required"),
  notes: z.string().optional(),
})

export const historicalFigureFormInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  full_name: optionalStringField,
  authority: z.string().min(1, "Authority is required"),
  reign_start: optionalStringField,
  reign_end: optionalStringField,
  reign_note: optionalStringField,
  birth: optionalStringField,
  death: optionalStringField,
  altNames: optionalStringField,
  flavour_text: optionalStringField,
  historical_sources: optionalStringField,
  timeline_id: optionalStringField,
  artifacts_id: optionalStringField,
  places_id: optionalStringField,
})

export const historicalFigureFormSchema = historicalFigureFormInputSchema
  .transform((data) => ({
    ...data,
    reign_start: data.reign_start ? parseInt(data.reign_start) : null,
    reign_end: data.reign_end ? parseInt(data.reign_end) : null,
    birth: data.birth ? parseInt(data.birth) : null,
    death: data.death ? parseInt(data.death) : null,
    altNames:
      data.altNames && data.altNames !== ""
        ? data.altNames
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : null,
    historical_sources: data.historical_sources
      ? (JSON.parse(data.historical_sources) as {
          citation: string
          notes?: string
        }[])
      : [],
    timeline_id:
      data.timeline_id && data.timeline_id !== ""
        ? data.timeline_id
            .split(",")
            .map((item) => parseInt(item.trim()))
            .filter((num) => !isNaN(num))
        : null,
    artifacts_id:
      data.artifacts_id && data.artifacts_id !== ""
        ? data.artifacts_id
            .split(",")
            .map((item) => parseInt(item.trim()))
            .filter((num) => !isNaN(num))
        : null,
    places_id:
      data.places_id && data.places_id !== ""
        ? data.places_id
            .split(",")
            .map((item) => parseInt(item.trim()))
            .filter((num) => !isNaN(num))
        : null,
  }))
  .refine(
    (data) => {
      // Custom validation: reign_end should be >= reign_start if both are provided
      if (data.reign_start && data.reign_end) {
        return data.reign_end >= data.reign_start
      }
      return true
    },
    {
      message: "Reign end year must be after or equal to start year",
      path: ["reign_end"],
    },
  )

export type HistoricalFigureFormInputData = z.infer<
  typeof historicalFigureFormInputSchema
>
export type HistoricalFigureFormData = z.infer<
  typeof historicalFigureFormSchema
>
