import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { somnus_collection } from "~/server/db/schemas/somnus-collection"

type UpdateData = {
  nickname?: string
  legend_o?: string | null
  legend_o_expanded?: string | null
  legend_o_translation?: string | null
  desc_o?: string | null
  legend_r?: string | null
  legend_r_expanded?: string | null
  legend_r_translation?: string | null
  desc_r?: string | null
  flavour_text?: string | null
  godName?: string | null
  devices?: string[] | null
  sets?: string[] | null
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15
    const { id } = await params

    // Parse the request body
    const body = (await request.json()) as UpdateData
    const {
      nickname,
      legend_o,
      legend_o_expanded,
      legend_o_translation,
      desc_o,
      legend_r,
      legend_r_expanded,
      legend_r_translation,
      desc_r,
      flavour_text,
      godName,
      devices,
      sets,
    } = body

    // Build update object
    const updateData: Record<string, string | string[] | null> = {}
    if (nickname !== undefined) updateData.nickname = nickname
    if (legend_o !== undefined) updateData.legend_o = legend_o
    if (legend_o_expanded !== undefined)
      updateData.legend_o_expanded = legend_o_expanded
    if (legend_o_translation !== undefined)
      updateData.legend_o_translation = legend_o_translation
    if (desc_o !== undefined) updateData.desc_o = desc_o
    if (legend_r !== undefined) updateData.legend_r = legend_r
    if (legend_r_expanded !== undefined)
      updateData.legend_r_expanded = legend_r_expanded
    if (legend_r_translation !== undefined)
      updateData.legend_r_translation = legend_r_translation
    if (desc_r !== undefined) updateData.desc_r = desc_r
    if (flavour_text !== undefined) updateData.flavour_text = flavour_text
    if (godName !== undefined) updateData.godName = godName
    if (devices !== undefined) updateData.devices = devices
    if (sets !== undefined) updateData.sets = sets

    // Update the item in the database
    const updatedItems = await db
      .update(somnus_collection)
      .set(updateData)
      .where(eq(somnus_collection.id, parseInt(id)))
      .returning()

    if (updatedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItems[0],
    })
  } catch (error) {
    console.error("Error updating somnus collection item:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
