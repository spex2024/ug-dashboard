import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware for route protection
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const authToken = request.cookies.get("authToken")?.value;

    // ✅ Already authenticated trying to access login → redirect to dashboard
    if (path === "/login" && authToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // ✅ Not authenticated trying to access protected pages → redirect to login
    if (
        (path === "/" ||
            path.startsWith("/dashboard")) &&
        !authToken
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Otherwise, allow the request
    return NextResponse.next();
}

// ✅ Correct matcher
export const config = {
    matcher: [
        "/",
        "/login",
        "/dashboard/:path*", // catch all dashboard sub-routes
    ],
};
