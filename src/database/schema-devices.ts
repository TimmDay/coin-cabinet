export type Device = {
  id: string // uuid
  name: string
  translation?: string | null
  description: string
  category?: string | null
  sources: string[] // jsonb stored as array of strings
  artifact_ids: string[] // uuid[]
  img?: string | null
  created_at: string
  updated_at: string
}
