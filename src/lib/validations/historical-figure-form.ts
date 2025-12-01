import { z } from "zod"

export const historicalSourceSchema = z.object({
  citation: z.string().min(1, "Citation is required"),
  notes: z.string().optional(),
})

export const historicalFigureFormInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  full_name: z.string().optional(),
  authority: z.string().min(1, "Authority is required"),
  reign_start: z.string().optional(),
  reign_end: z.string().optional(),
  reign_note: z.string().optional(),
  birth: z.string().optional(),
  death: z.string().optional(),
  dynasty: z.string().optional(),
  flavour_text: z.string().optional(),
  historical_sources: z.string().optional(),
  timeline_id: z.string().optional(),
  artifacts_id: z.string().optional(),
})

export const historicalFigureFormSchema =
  historicalFigureFormInputSchema.transform((data) => ({
    ...data,
    reign_start: data.reign_start ? parseInt(data.reign_start) : null,
    reign_end: data.reign_end ? parseInt(data.reign_end) : null,
    birth: data.birth ? parseInt(data.birth) : null,
    death: data.death ? parseInt(data.death) : null,
    historical_sources: data.historical_sources
      ? (JSON.parse(data.historical_sources) as {
          citation: string
          notes?: string
        }[])
      : [],
    timeline_id: data.timeline_id
      ? data.timeline_id
          .split(",")
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n))
      : null,
    artifacts_id: data.artifacts_id
      ? data.artifacts_id
          .split(",")
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n))
      : null,
  }))

export type HistoricalFigureFormInputData = z.infer<
  typeof historicalFigureFormInputSchema
>
export type HistoricalFigureFormData = z.infer<
  typeof historicalFigureFormSchema
>
