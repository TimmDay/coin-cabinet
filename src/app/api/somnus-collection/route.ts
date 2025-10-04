import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET(request: Request) {
  try {
    console.log(
      "🚀 GET /api/somnus-collection - Fetching coins (public access)",
    );

    // Use server client but don't require authentication for GET
    const supabase = await createClient();

    // Check if we should include all coins (for admin purposes)
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    let query = supabase.from("somnus_collection").select("*");

    // Only filter for coins with obverse images if not requesting all coins
    if (!includeAll) {
      query = query.not("image_link_o", "is", null).neq("image_link_o", "");
    }

    const { data, error } = await query
      .order("reign_start", {
        ascending: true,
        nullsFirst: false,
      })
      .order("mint_year_earliest", {
        ascending: true,
        nullsFirst: false,
      })
      .order("diameter", {
        ascending: true,
        nullsFirst: false,
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch somnus coins",
          error: error.message,
        },
        { status: 500 },
      );
    }

    console.log(
      `📋 Found ${data.length} coins${includeAll ? " (including all)" : " with obverse images"}`,
    );
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("Error fetching somnus coins:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch somnus coins",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Use server client for authenticated requests
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = (await request.json()) as { id?: number };
    const { id } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid id is required" },
        { status: 400 },
      );
    }

    // Delete somnus coin
    const { error } = await supabase
      .from("somnus_collection")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete somnus coin",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Somnus coin deleted successfully!",
    });
  } catch (error: unknown) {
    console.error("Error deleting somnus coin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete somnus coin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
