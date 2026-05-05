import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { Device } from "~/database/schema-devices"
import { createClient } from "~/database/supabase-server"
import type { DeviceFormData } from "~/lib/validations/device-form"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

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

    const body = (await request.json()) as DeviceFormData

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      )
    }

    if (!body.description || typeof body.description !== "string") {
      return NextResponse.json(
        { success: false, message: "Description is required" },
        { status: 400 },
      )
    }

    const result = await supabase.from("devices").insert(body).select().single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add device",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Device added successfully",
      device: result.data as Device,
    })
  } catch (error) {
    console.error("Error in POST /api/devices/admin:", error)

    if (error instanceof ZodError) {
      const fieldErrors = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ")
      return NextResponse.json(
        { success: false, message: `Validation failed: ${fieldErrors}` },
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
    const supabase = await createClient()

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

    const { id, updates } = (await request.json()) as {
      id: string
      updates: Partial<DeviceFormData>
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid device ID is required" },
        { status: 400 },
      )
    }

    const result = await supabase
      .from("devices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update device",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Device updated successfully",
      device: result.data as Device,
    })
  } catch (error) {
    console.error("Error in PUT /api/devices/admin:", error)
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
    const supabase = await createClient()

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

    const { id } = (await request.json()) as { id: string }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid device ID is required" },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("devices").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete device",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Device deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/devices/admin:", error)
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
