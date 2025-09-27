import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Test")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch fruits",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Error fetching fruits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch fruits",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/fruits - Adding fruit");

    // Require authentication for POST operations
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("❌ No session found for POST operation");
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required for adding fruits",
        },
        { status: 401 },
      );
    }

    console.log("✅ Authenticated user:", session.user.email);

    // Parse request body
    const body = (await request.json()) as { fruitName?: string };
    const { fruitName } = body;
    console.log("📦 Request body:", body);
    console.log("🔍 Attempting to insert fruit:", fruitName);

    if (!fruitName || typeof fruitName !== "string") {
      return NextResponse.json(
        { success: false, message: "Fruit name is required" },
        { status: 400 },
      );
    }

    // Insert fruit
    const result = await supabase
      .from("Test")
      .insert([{ fruitName }])
      .select()
      .single();

    console.log("💾 Insert result:", result);

    if (result.error) {
      console.error("Supabase error:", result.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add fruit",
          error: result.error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: result.data,
      message: "Fruit added successfully!",
    });
  } catch (error: unknown) {
    console.error("Error adding fruit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add fruit",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("🚀 DELETE /api/fruits - Deleting fruit");
    const body = (await request.json()) as { id?: number };
    const { id } = body;
    console.log("📦 Request body:", { id });

    if (!id || typeof id !== "number") {
      console.log("❌ Invalid ID");
      return NextResponse.json(
        { success: false, message: "Valid id is required" },
        { status: 400 },
      );
    }

    console.log("🔍 Attempting to delete fruit with ID:", id);

    // Debug: Check what cookies we're receiving
    const cookieHeader = request.headers.get("cookie");
    console.log("🍪 Raw cookies received:", cookieHeader);

    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    console.log("🔐 Auth check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      authError: authError?.message,
    });

    // Check if user is authenticated before attempting delete
    if (!session) {
      console.log("❌ No session found - delete will fail due to RLS");
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required for delete operation",
        },
        { status: 401 },
      );
    }

    const { error } = await supabase.from("Test").delete().eq("id", id);
    console.log("💾 Delete result:", { error });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete fruit",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fruit deleted successfully!",
    });
  } catch (error: unknown) {
    console.error("Error deleting fruit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete fruit",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
