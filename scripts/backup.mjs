import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import fs from "fs/promises"
import path from "path"
import postgres from "postgres"

// Load environment variables
config()

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables")
  process.exit(1)
}

const conn = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
})

const db = drizzle(conn)

async function createDatabaseBackup() {
  try {
    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const backupDir = path.join(process.cwd(), "backups")

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true })

    // Export somnus_collection data using raw SQL since we don't have the schema imported
    const coins = await conn`SELECT * FROM somnus_collection ORDER BY id`

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

    await conn.end()
    return backupFile
  } catch (error) {
    console.error("❌ Backup failed:", error)
    await conn.end()
    throw error
  }
}

createDatabaseBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
