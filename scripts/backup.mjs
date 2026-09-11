import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import fs from "fs/promises"
import path from "path"

// Load environment variables
config()

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.error("❌ Supabase environment variables are not set")
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const TABLES = [
  "somnus_collection",
  "deities",
  "mints",
  "artifacts",
  "devices",
  "historical_figures",
  "places",
  "timelines",
]

async function fetchTable(table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch ${table} for backup: ${error.message}`)
  }

  return data || []
}

async function createDatabaseBackup() {
  try {
    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const backupDir = path.join(process.cwd(), "backups")

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true })

    const tables = {}
    const totalRecords = {}

    for (const table of TABLES) {
      const rows = await fetchTable(table)
      tables[table] = rows
      totalRecords[table] = rows.length
    }

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "3.0",
      tables,
      metadata: {
        totalRecords,
        exportedBy: "automated-backup",
      },
    }

    // Write backup file
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2))

    console.log(`✅ Backup created: ${backupFile}`)
    console.log(`📊 Exported records:`)
    for (const table of TABLES) {
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
