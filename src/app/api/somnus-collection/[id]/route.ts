import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import type { CoinEnhanced, CoinUpdateData } from "~/types/api"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Create public supabase client (no authentication required for GET)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for server client
          },
        },
      },
    )

    // Await params in Next.js 15
    const { id } = await params

    // Check if we should include deity data
    const url = new URL(request.url)
    const includeDeities = url.searchParams.get("include")?.includes("deities")
    const includeHistoricalFigures = url.searchParams
      .get("include")
      ?.includes("historical-figures")

    const coinResult = await supabase
      .from("somnus_collection")
      .select("*")
      .eq("id", parseInt(id))
      .single<SomnusCollection>()

    if (coinResult.error) {
      console.error("Supabase coin fetch error:", coinResult.error)
      throw new Error(`Database fetch failed: ${coinResult.error.message}`)
    }

    const coin = coinResult.data

    if (!coin) {
      return NextResponse.json(
        { success: false, message: "Coin not found" },
        { status: 404 },
      )
    }

    // Use coin data directly (already properly typed)
    const typedCoin = coin

    // If deities are requested and coin has deity_id array, fetch deity details
    let coinWithDeities: CoinEnhanced = typedCoin
    if (
      includeDeities &&
      typedCoin.deity_id &&
      Array.isArray(typedCoin.deity_id) &&
      typedCoin.deity_id.length > 0
    ) {
      // Convert string IDs to numbers for the query
      const deityIds = typedCoin.deity_id
        .map((id: string) => parseInt(id))
        .filter((id: number) => !isNaN(id))

      if (deityIds.length > 0) {
        const { data: deities, error: deitiesError } = await supabase
          .from("deities")
          .select(
            "id, name, subtitle, flavour_text, secondary_info, features_coinage",
          )
          .in("id", deityIds)

        if (deitiesError) {
          console.error("Supabase deities fetch error:", deitiesError)
          // Don't fail the whole request if deities can't be fetched
        } else {
          coinWithDeities = {
            ...coin,
            deities: deities || [],
          }
        }
      }
    }

    // If historical figures are requested and coin has historical_figures_id array, fetch details
    if (
      includeHistoricalFigures &&
      typedCoin.historical_figures_id &&
      Array.isArray(typedCoin.historical_figures_id) &&
      typedCoin.historical_figures_id.length > 0
    ) {
      // Convert string IDs to numbers for the query
      const figureIds = typedCoin.historical_figures_id
        .map((id: string) => parseInt(id))
        .filter((id: number) => !isNaN(id))

      if (figureIds.length > 0) {
        const { data: figures, error: figuresError } = await supabase
          .from("historical_figures")
          .select(
            "id, name, full_name, authority, reign_start, reign_end, birth, death, altNames, flavour_text",
          )
          .in("id", figureIds)

        if (figuresError) {
          console.error(
            "Supabase historical figures fetch error:",
            figuresError,
          )
          // Don't fail the whole request if figures can't be fetched
        } else {
          coinWithDeities = {
            ...coinWithDeities,
            historical_figures: figures || [],
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: coinWithDeities,
    })
  } catch (error) {
    console.error("Error fetching coin:", error)

    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV !== "production" && {
          error: error instanceof Error ? error.stack : String(error),
        }),
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for server client
          },
        },
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Await params in Next.js 15
    const { id } = await params

    // Parse the request body and filter out undefined values
    const body = (await request.json()) as CoinUpdateData
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined),
    )

    // Update the item in the database using Supabase client (respects RLS)
    const { data: updatedItems, error: updateError } = await supabase
      .from("somnus_collection")
      .update(updateData)
      .eq("id", parseInt(id))
      .eq("user_id", user.id)
      .select()

    if (updateError) {
      console.error("Supabase update error:", updateError)
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    if (!updatedItems || updatedItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found or you do not have permission to update it",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      data: (updatedItems as unknown[])?.[0] ?? null,
    })
  } catch (error) {
    console.error("Error updating somnus collection item:", error)

    // Provide more specific error information in development
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        // Include error details in development only
        ...(process.env.NODE_ENV !== "production" && {
          error: error instanceof Error ? error.stack : String(error),
        }),
      },
      { status: 500 },
    )
  }
}
