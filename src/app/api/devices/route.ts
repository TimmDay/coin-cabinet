import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"

export async function GET(_request: Request) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch devices",
          error:
            process.env.NODE_ENV === "production" ? undefined : error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error instanceof Error
              ? error.message
              : "Unknown error",
      },
      { status: 500 },
    )
  }
}
