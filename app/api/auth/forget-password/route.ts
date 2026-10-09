import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/authProxy";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = getBackendUrl();

        const backendResponse = await fetch(`${backendUrl}/api/auth/forget-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error: any) {
        console.error("Forget-password route handler error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process forget password request" },
            { status: 500 }
        );
    }
}
