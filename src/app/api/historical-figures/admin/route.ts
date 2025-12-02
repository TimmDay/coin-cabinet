import { NextResponse } from "next/server"
import { ZodError } from "zod"
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json()
    const figureData = body as Omit<
      HistoricalFigure,
      "id" | "created_at" | "updated_at" | "user_id"
    >

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await supabase
      .from("historical_figures")
      .insert({
        ...figureData,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
    })
  } catch (error) {
    console.error("Unexpected error:", error)

    if (error instanceof ZodError) {
      const fieldErrors = error.errors
        .map((err) => {
          const field = err.path.join(".")
          return `${field}: ${err.message}`
        })
        .join("; ")
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${fieldErrors}`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
