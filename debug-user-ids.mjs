// Debug script to check user_id matching
import { createServerClient } from "@supabase/ssr"

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return []
      },
      setAll() {},
    },
  },
)

// Check what records exist and their user_ids
console.log("=== DEBUGGING USER_ID MISMATCH ===")

// Get all records to see user_ids
const { data: allRecords } = await supabase
  .from('somnus_collection')
  .select('id, nickname, user_id')
  .limit(5)

console.log("Sample records with user_ids:")
allRecords?.forEach(record => {
  console.log(`ID: ${record.id}, Nickname: ${record.nickname}, User ID: ${record.user_id}`)
})

export { }
