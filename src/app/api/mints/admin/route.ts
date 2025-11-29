import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { Mint } from "~/database/schema-mints"
import { createClient } from "~/database/supabase-server"
import type { MintFormData } from "~/lib/validations/mint-form"

export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/mints/admin - Adding new mint")

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

    // Parse request body
    const body = (await request.json()) as MintFormData

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
    const mintData = {
      ...body,
      user_id: user.id,
    }

    // Insert mint
    const result = await supabase
      .from("mints")
      .insert(mintData)
      .select()
      .single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add mint",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully added mint: ${body.name}`)

    return NextResponse.json({
      success: true,
      message: "Mint added successfully",
      mint: result.data as Mint,
    })
  } catch (error) {
    console.error("Error in POST /api/mints/admin:", error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : (error as Error).message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("🚀 PUT /api/mints/admin - Updating mint")

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

    // Parse request body
    const { id, updates } = (await request.json()) as {
      id: number
      updates: Partial<MintFormData>
    }

    // Validate ID
    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid mint ID is required" },
        { status: 400 },
      )
    }

    // Update mint
    const result = await supabase
      .from("mints")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update mint",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully updated mint with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Mint updated successfully",
      mint: result.data as Mint,
    })
  } catch (error) {
    console.error("Error in PUT /api/mints/admin:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : (error as Error).message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("🚀 DELETE /api/mints/admin - Deleting mint")

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

    // Parse request body
    const { id } = (await request.json()) as { id: number }

    // Validate ID
    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid mint ID is required" },
        { status: 400 },
      )
    }

    // Delete mint
    const { error } = await supabase.from("mints").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete mint",
          error: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully deleted mint with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Mint deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE /api/mints/admin:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : (error as Error).message,
      },
      { status: 500 },
    )
  }
}
