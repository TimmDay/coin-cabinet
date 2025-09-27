import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { coinFormSchema } from "~/lib/validations/coin-form";
import { ZodError } from "zod";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

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

    // Parse and validate the request body
    const body: unknown = await request.json();
    console.log("Received request body for somnus collection:", JSON.stringify(body, null, 2));

    const validatedData = coinFormSchema.parse(body);
    console.log("Validated data for somnus collection:", JSON.stringify(validatedData, null, 2));

    // Insert the data into somnus_collection table with user_id
    const tableName = "somnus_collection";
    console.log("Using table:", tableName);

    // Add user_id to the validated data
    const dataWithUserId = {
      ...validatedData,
      user_id: session.user.id
    };

    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase.from(tableName).insert(dataWithUserId).select().single();

    const { data, error } = result;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add coin to somnus collection",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coin added to somnus collection successfully!",
      coin: data as { id: number; nickname: string; created_at: string },
    });
  } catch (error: unknown) {
    console.error("Error adding coin to somnus collection:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      console.error("Validation error details:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add coin to somnus collection",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
