/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export function getBackendUrl(): string {
    // Priority: API_URL (server-only) > NEXT_PUBLIC_BASE_URL > fallback
    return (
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:4000"
    ).replace(/\/$/, "");
}

export function getAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: maxAgeSeconds,
    };
}

export function extractTokenFromSetCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function createAuthResponse(
    data: any,
    status: number,
    token?: string | null
): NextResponse {
    const response = NextResponse.json(data, { status });

    if (token) {
        response.cookies.set("token", token, getAuthCookieOptions());
    }

    return response;
}
