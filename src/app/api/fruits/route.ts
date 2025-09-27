import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Create anonymous Supabase client for public access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Fetch fruits (public access)
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
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: unknown) {
    console.error("Error fetching fruits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch fruits",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Create authenticated Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json() as { fruitName?: string }
    const { fruitName } = body

    if (!fruitName || typeof fruitName !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid fruitName is required' },
        { status: 400 }
      );
    }

    // Insert fruit
    const result = await supabase
      .from("Test")
      .insert([{ fruitName }])
      .select()
      .single();

    if (result.error) {
      console.error("Supabase error:", result.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add fruit",
          error: result.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fruit added successfully!",
      data: result.data as { id: number; fruitName: string; created_at: string },
    });

  } catch (error: unknown) {
    console.error("Error adding fruit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add fruit",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Create authenticated Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json() as { id?: number }
    const { id } = body

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Valid id is required' },
        { status: 400 }
      );
    }

    // Delete fruit
    const { error } = await supabase.from("Test").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete fruit",
          error: error.message,
        },
        { status: 500 }
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
      { status: 500 }
    );
  }
}
