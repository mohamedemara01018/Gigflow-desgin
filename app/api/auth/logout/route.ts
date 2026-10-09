import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/authProxy";

export async function POST(request: NextRequest) {
    try {
        const backendUrl = getBackendUrl();
        const token = request.cookies.get("token")?.value;

        // Forward to backend if needed to invalidate server session
        try {
            await fetch(`${backendUrl}/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: token ? `token=${token}` : "",
                },
            });
        } catch (e) {
            console.warn("Backend logout notification warning:", e);
        }

        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });

        // Delete frontend cookie explicitly
        response.cookies.delete("token");
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error: any) {
        console.error("Logout route handler error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to process logout" },
            { status: 500 }
        );
    }
}
