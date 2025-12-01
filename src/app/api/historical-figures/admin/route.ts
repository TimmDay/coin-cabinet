import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"
import type { HistoricalFigure } from "~/database/schema-historical-figures"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    const body = (await request.json()) as Omit<
      HistoricalFigure,
      "id" | "created_at" | "updated_at" | "user_id"
    >

    const { data, error } = await supabase
      .from("historical_figures")
      .insert({
        ...body,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating historical figure:", error)
      return NextResponse.json(
        { success: false, message: "Failed to create historical figure" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
