import type { Citation } from "./schema-citations"

export type Device = {
  id: string // uuid
  name: string
  translation?: string | null
  description: string
  category?: string | null
  citations?: Citation[]
  artifact_ids: string[] // uuid[]
  img?: string | null
  created_at: string
  updated_at: string
}
