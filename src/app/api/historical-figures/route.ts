import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("historical_figures")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching historical figures:", error)
      return NextResponse.json(
        { success: false, message: "Failed to fetch historical figures" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
