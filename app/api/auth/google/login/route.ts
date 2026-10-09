import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/authProxy";

export async function GET(request: NextRequest) {
    const backendUrl = getBackendUrl();
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${backendUrl}/api/auth/google/login${searchParams ? `?${searchParams}` : ""}`;
    return NextResponse.redirect(targetUrl);
}
