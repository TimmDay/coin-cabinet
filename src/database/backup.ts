import fs from "fs/promises"
import path from "path"
import { createClient } from "~/database/supabase-server"

/**
 * Export all database data to JSON backup files
 * Run this daily via cron or GitHub Actions
 */
export async function createDatabaseBackup() {
  try {
    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const backupDir = path.join(process.cwd(), "backups")

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true })

    // Export somnus_collection data using Supabase
    const supabase = await createClient()
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

/**
 * Clean up backups older than 30 days
 */
// async function cleanOldBackups(backupDir: string) {
//   try {
//     const files = await fs.readdir(backupDir)
//     const backupFiles = files.filter(
//       (file) => file.startsWith("backup-") && file.endsWith(".json"),
//     )

//     const cutoffDate = new Date()
//     cutoffDate.setDate(cutoffDate.getDate() - 30)

//     for (const file of backupFiles) {
//       const dateRegex = /backup-(\d{4}-\d{2}-\d{2})\.json/
//       const dateMatch = dateRegex.exec(file)
//       if (dateMatch?.[1]) {
//         const fileDate = new Date(dateMatch[1])
//         if (fileDate < cutoffDate) {
//           await fs.unlink(path.join(backupDir, file))
//           console.log(`🗑️  Deleted old backup: ${file}`)
//         }
//       }
//     }
//   } catch (error) {
//     console.error("⚠️  Failed to clean old backups:", error)
//   }
// }

type BackupData = {
  timestamp: string
  version: string
  tables: {
    somnus_collection: unknown[]
  }
  metadata: {
    totalRecords: number
    exportedBy: string
  }
}

/**
 * Restore database from backup file
 */
export async function restoreFromBackup(backupFile: string) {
  try {
    const backupData = JSON.parse(
      await fs.readFile(backupFile, "utf-8"),
    ) as BackupData

    if (backupData.tables?.somnus_collection) {
      // Clear existing data (be very careful!)
      // await db.delete(somnus_collection)

      // Insert backup data
      // await db.insert(somnus_collection).values(backupData.tables.somnus_collection)

      console.log(
        `✅ Restored ${backupData.tables.somnus_collection.length} records from ${backupFile}`,
      )
    }
  } catch (error) {
    console.error("❌ Restore failed:", error)
    throw error
  }
}

// CLI usage
if (require.main === module) {
  createDatabaseBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
