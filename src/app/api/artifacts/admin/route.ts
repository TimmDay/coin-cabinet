import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"
import { artifactFormSchema } from "~/lib/validations/artifact-form"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = artifactFormSchema.parse(body)

    const { data: artifact, error } = await supabase
      .from("artifacts")
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      console.error("Error creating artifact:", error)
      return NextResponse.json(
        { error: "Failed to create artifact" },
        { status: 500 },
      )
    }

    // Revalidate the admin page to refresh the data
    revalidatePath("/admin/edit-artifacts")

    return NextResponse.json(artifact, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Artifact ID is required" },
        { status: 400 },
      )
    }

    const validatedData = artifactFormSchema.parse(updateData)

    const { data: artifact, error } = await supabase
      .from("artifacts")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating artifact:", error)
      return NextResponse.json(
        { error: "Failed to update artifact" },
        { status: 500 },
      )
    }

    // Revalidate the admin page to refresh the data
    revalidatePath("/admin/edit-artifacts")

    return NextResponse.json(artifact)
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      )
    }

    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Artifact ID is required" },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("artifacts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting artifact:", error)
      return NextResponse.json(
        { error: "Failed to delete artifact" },
        { status: 500 },
      )
    }

    // Revalidate the admin page to refresh the data
    revalidatePath("/admin/edit-artifacts")

    return NextResponse.json({ message: "Artifact deleted successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
