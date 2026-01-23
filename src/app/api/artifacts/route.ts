import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: artifacts, error } = await supabase
      .from("artifacts")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching artifacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch artifacts" },
        { status: 500 },
      )
    }

    return NextResponse.json(artifacts)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
