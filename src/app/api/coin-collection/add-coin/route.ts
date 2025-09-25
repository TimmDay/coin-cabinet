import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { env } from "~/env";
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
    console.log("Received request body:", JSON.stringify(body, null, 2));

    const validatedData = coinFormSchema.parse(body);
    console.log("Validated data:", JSON.stringify(validatedData, null, 2));

    // Insert the data using Supabase client with environment-specific table
    const tableName = env.COIN_COLLECTION_TABLE;
    console.log("Using table:", tableName);

    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase.from(tableName).insert(validatedData).select().single();

    const { data, error } = result;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add coin",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coin added successfully!",
      coin: data,
    });
  } catch (error: unknown) {
    console.error("Error adding coin:", error);

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
        message: "Failed to add coin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
