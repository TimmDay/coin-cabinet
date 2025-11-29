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
    const { data: coins, error: coinsError } = await supabase
      .from("somnus_collection")
      .select("*")
      .order("id", { ascending: true })

    if (coinsError) {
      throw new Error(`Failed to fetch coins for backup: ${coinsError.message}`)
    }

    if (!coins) {
      throw new Error("No coin data returned from database")
    }

    // Export deities data
    const { data: deities, error: deitiesError } = await supabase
      .from("deities")
      .select("*")
      .order("id", { ascending: true })

    if (deitiesError) {
      throw new Error(
        `Failed to fetch deities for backup: ${deitiesError.message}`,
      )
    }

    // Export mints data
    const { data: mints, error: mintsError } = await supabase
      .from("mints")
      .select("*")
      .order("id", { ascending: true })

    if (mintsError) {
      throw new Error(`Failed to fetch mints for backup: ${mintsError.message}`)
    }

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "2.0",
      tables: {
        somnus_collection: coins || [],
        deities: deities || [],
        mints: mints || [],
      },
      metadata: {
        totalRecords: {
          coins: coins?.length || 0,
          deities: deities?.length || 0,
          mints: mints?.length || 0,
        },
        exportedBy: "automated-backup",
      },
    }

    // Write backup file
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2))

    console.log(`✅ Backup created: ${backupFile}`)
    console.log(`📊 Exported records:`)
    console.log(`   - ${coins?.length || 0} coins`)
    console.log(`   - ${deities?.length || 0} deities`)
    console.log(`   - ${mints?.length || 0} mints`)

    return backupFile
  } catch (error) {
    console.error("❌ Backup failed:", error)
    throw error
  }
}

createDatabaseBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
