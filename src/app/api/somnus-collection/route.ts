import { NextResponse } from "next/server";
import { createPublicClient } from "~/lib/supabase";
import { createServerClient } from "~/lib/supabase-server";

export async function GET() {
  try {
    // Use public client for public access
    const supabase = createPublicClient();

    // Fetch somnus coins (public access)
    const { data, error } = await supabase
      .from("somnus_collection")
      .select("*")
      .order("created_at", { ascending: false });

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
    const supabase = await createServerClient();

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
