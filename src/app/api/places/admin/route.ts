import { NextResponse } from "next/server"
import type { PostgrestSingleResponse } from "@supabase/supabase-js"
import { ZodError } from "zod"
import { createClient } from "~/database/supabase-server"
import type { Place } from "~/database/schema-places"
import type { PlaceFormData } from "~/lib/validations/place-form"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Parse request body - data is already validated and transformed on client side
    const body = (await request.json()) as PlaceFormData

    // Validate required fields
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      )
    }

    if (typeof body.lat !== "number" || typeof body.lng !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Valid latitude and longitude are required",
        },
        { status: 400 },
      )
    }

    // Prepare data for insertion
    const placeData = {
      ...body,
      user_id: user.id,
    }

    const result: PostgrestSingleResponse<Place> = await supabase
      .from("places")
      .insert([placeData])
      .select()
      .single()

    const { data, error } = result

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create place",
          error: error.message,
        },
        { status: 500 },
      )
    }

    const place = data

    if (!place) {
      return NextResponse.json(
        {
          success: false,
          message: "Place not returned from database",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      place,
      message: "Place created successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/places/admin:", error)

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
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    const body: unknown = await request.json()
    const { id, ...updates } = body as { id: number; [key: string]: unknown }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Place ID is required",
        },
        { status: 400 },
      )
    }

    // Updates are already validated and transformed on the client side
    // Just pass them through to Supabase

    const result: PostgrestSingleResponse<Place> = await supabase
      .from("places")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    const { data, error } = result

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update place",
          error: error.message,
        },
        { status: 500 },
      )
    }

    const place = data

    if (!place) {
      return NextResponse.json(
        {
          success: false,
          message: "Place not returned from database",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      place,
      message: "Place updated successfully",
    })
  } catch (error) {
    console.error("Error in PUT /api/places/admin:", error)

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
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Place ID is required",
        },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.from("places").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete place",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Place deleted successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete place",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
