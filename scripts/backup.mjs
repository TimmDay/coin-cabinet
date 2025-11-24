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

async function createDatabaseBackup() {
  try {
    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const backupDir = path.join(process.cwd(), "backups")

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true })

    // Export somnus_collection data using Supabase
    const { data: coins, error } = await supabase
      .from("somnus_collection")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch coins for backup: ${error.message}`)
    }

    if (!coins) {
      throw new Error("No coin data returned from database")
    }

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      tables: {
        somnus_collection: coins,
      },
      metadata: {
        totalRecords: coins.length,
        exportedBy: "automated-backup",
      },
    }

    // Write backup file
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2))

    console.log(`✅ Backup created: ${backupFile}`)
    console.log(`📊 Exported ${coins.length} coin records`)

    return backupFile
  } catch (error) {
    console.error("❌ Backup failed:", error)
    throw error
  }
}

createDatabaseBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
