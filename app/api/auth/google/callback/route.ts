import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, getAuthCookieOptions, extractTokenFromSetCookie } from "@/lib/authProxy";

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token");
        const isIdentityVerified = request.nextUrl.searchParams.get("isIdentityVerified");

        if (token) {
            const destination = isIdentityVerified === "false" ? "/verify-identity" : "/";
            const response = NextResponse.redirect(new URL(destination, request.url));
            response.cookies.set("token", token, getAuthCookieOptions());
            return response;
        }

        // Fallback: proxy directly to backend if invoked without pre-set token
        const backendUrl = getBackendUrl();
        const searchParams = request.nextUrl.searchParams.toString();
        const url = `${backendUrl}/api/auth/google/callback${searchParams ? `?${searchParams}` : ""}`;

        const backendResponse = await fetch(url, {
            method: "GET",
            headers: {
                Cookie: request.headers.get("cookie") || "",
            },
            redirect: "manual",
        });

        const setCookieHeader = backendResponse.headers.get("set-cookie");
        const extractedToken = extractTokenFromSetCookie(setCookieHeader);
        const redirectLocation = backendResponse.headers.get("location") || "/";

        const response = NextResponse.redirect(new URL(redirectLocation, request.url));

        if (extractedToken) {
            response.cookies.set("token", extractedToken, getAuthCookieOptions());
        }

        return response;
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }
}
