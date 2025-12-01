import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"
import type { HistoricalFigure } from "~/database/schema-historical-figures"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      )
    }

    const updates = (await request.json()) as Partial<
      Omit<HistoricalFigure, "id" | "created_at" | "updated_at" | "user_id">
    >

    const { data, error } = await supabase
      .from("historical_figures")
      .update(updates)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating historical figure:", error)
      return NextResponse.json(
        { success: false, message: "Failed to update historical figure" },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      )
    }

    const { error } = await supabase
      .from("historical_figures")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error deleting historical figure:", error)
      return NextResponse.json(
        { success: false, message: "Failed to delete historical figure" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Historical figure deleted successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
