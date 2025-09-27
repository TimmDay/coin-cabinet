import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "~/lib/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient(req.headers.get("cookie") ?? "");

  // Check if the route is an API route that needs protection
  const needsAuth =
    req.nextUrl.pathname.startsWith("/api/somnus-collection/add-coin") ||
    (req.nextUrl.pathname.startsWith("/api/fruits") && req.method !== "GET") ||
    (req.nextUrl.pathname.startsWith("/api/somnus-collection") &&
      req.method !== "GET");

  if (needsAuth) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session, return 401 Unauthorized
    if (!session) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Authentication required",
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        },
      );
    }
  }

  return res;
}

export const config = {
  matcher: ["/api/somnus-collection/:path*", "/api/fruits/:path*"],
};
