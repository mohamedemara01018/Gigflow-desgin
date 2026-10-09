import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl, getAuthCookieOptions, extractTokenFromSetCookie } from "@/lib/authProxy";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = getBackendUrl();

        const backendResponse = await fetch(`${backendUrl}/api/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        const setCookieHeader = backendResponse.headers.get("set-cookie");
        const tokenFromCookie = extractTokenFromSetCookie(setCookieHeader);
        const token = data?.data?.token || tokenFromCookie;

        const response = NextResponse.json(data, { status: backendResponse.status });

        if (token) {
            response.cookies.set("token", token, getAuthCookieOptions());
        }

        return response;
    } catch (error: any) {
        console.error("Verify-email route handler error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process email verification" },
            { status: 500 }
        );
    }
}
