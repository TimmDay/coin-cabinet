import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import fs from "fs/promises"
import path from "path"

// Load environment variables
config()

// The anon key can't read owner-only tables (collection, provenance_events,
// ...), so a real backup needs the service-role key. It bypasses RLS: keep it
// out of NEXT_PUBLIC_* vars and never commit it.
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
  )
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

// Every table in schema.sql, with the column(s) to order by. A stable order is
// required for pagination to neither skip nor repeat rows.
const TABLES = {
  places: ["id"],
  persons: ["id"],
  deities: ["id"],
  devices: ["id"],
  sources: ["id"],
  mints: ["id"],
  artifacts: ["id"],
  timelines: ["id"],
  mint_operation_periods: ["id"],
  deity_places: ["deity_id", "place_id"],
  device_deities: ["device_id", "deity_id"],
  person_places: ["person_id", "place_id"],
  timeline_events: ["id"],
  collection: ["id"],
  coins: ["id"],
  sets: ["id"],
  provenance_events: ["id"],
  item_presentation: ["id"],
  media: ["id"],
  coin_images: ["id"],
  coin_catalogue_references: ["id"],
  coin_notable_features: ["id"],
  coin_devices: ["coin_id", "device_id", "side"],
  item_sets: ["item_id", "set_id"],
  item_persons: ["id"],
  item_deities: ["id"],
  item_places: ["id"],
  item_timelines: ["item_id", "timeline_id"],
  item_artifacts: ["id"],
  supporting_images: ["presentation_id", "sequence"],
  entity_sources: ["id"],
}

// PostgREST caps a response at 1000 rows by default.
const PAGE_SIZE = 1000

async function fetchTable(table, orderBy) {
  const rows = []

  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase.from(table).select("*")
    for (const column of orderBy) {
      query = query.order(column, { ascending: true })
    }
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1)

    if (error) {
      throw new Error(`Failed to fetch ${table} for backup: ${error.message}`)
    }

    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
  }
}

async function createDatabaseBackup() {
  try {
    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const backupDir = path.join(process.cwd(), "backups")

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true })

    const tables = {}
    const totalRecords = {}

    for (const [table, orderBy] of Object.entries(TABLES)) {
      const rows = await fetchTable(table, orderBy)
      tables[table] = rows
      totalRecords[table] = rows.length
    }

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "4.0",
      tables,
      metadata: {
        totalRecords,
        exportedBy: "automated-backup",
      },
    }

    // Write backup file. It contains owner-only data (purchase prices,
    // vendors), so keep it readable by this user only.
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2), {
      mode: 0o600,
    })

    console.log(`✅ Backup created: ${backupFile}`)
    console.log(`📊 Exported records:`)
    for (const table of Object.keys(TABLES)) {
      console.log(`   - ${table}: ${totalRecords[table]}`)
    }

    return backupFile
  } catch (error) {
    console.error("❌ Backup failed:", error)
    throw error
  }
}

createDatabaseBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
