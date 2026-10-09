import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/authProxy";

export async function GET(request: NextRequest) {
    try {
        const backendUrl = getBackendUrl();
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. No token provided." },
                { status: 401 }
            );
        }

        const backendResponse = await fetch(`${backendUrl}/api/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`,
            },
        });

        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error: any) {
        console.error("User me route handler error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch current user" },
            { status: 500 }
        );
    }
}
