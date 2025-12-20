import { z } from "zod"

export const artifactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  img_src: z.string().optional().nullable(),
  institution_name: z.string().optional().nullable(),
  location_name: z.string().optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  medium: z.string().optional().nullable(),
  artist_designer: z.string().optional().nullable(),
  year_of_creation_estimate: z.number().int().optional().nullable(),
  flavour_text: z.string().optional().nullable(),
  historical_notes: z.string().optional().nullable(),
  historical_sources: z.array(z.string()).optional().nullable(),
})

export type ArtifactFormData = z.infer<typeof artifactFormSchema>
