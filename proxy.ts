import { jwtVerify, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./utils/enums.utils";

interface TokenPayload extends JWTPayload {
    email: string;
    role: "client" | "freelancer" | "admin" | string;
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
}

const clientRoutes = ["/client"];
const freelancerRoutes = ["/freelancer"];
const adminRoutes = ["/admin"];

const sharedProtectedRoutes = [
    "/profile",
    "/settings",
    "/proposals",
    "/upload-attachment",
    "/notification",
    "/messages",
    "/contracts",
    "/payments",
];

const authRoutes = [
    "/login",
    "/register",
    "/role",
    "/forgot-password",
    "/reset-password",
];

function isRouteMatch(pathname: string, routes: string[]): boolean {
    return routes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function getDashboardUrlForRole(role?: string): string {
    const normalizedRole = (role || "").toLowerCase();
    if (normalizedRole === UserRole.ADMIN || normalizedRole === "admin") {
        return "/admin/users";
    }
    if (normalizedRole === UserRole.CLIENT || normalizedRole === "client") {
        return "/client/jobs";
    }
    if (normalizedRole === UserRole.FREELANCER || normalizedRole === "freelancer") {
        return "/freelancer/proposals";
    }
    return "/";
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

    const isAuthRoute = isRouteMatch(pathname, authRoutes);
    const isClientRoute = isRouteMatch(pathname, clientRoutes);
    const isFreelancerRoute = isRouteMatch(pathname, freelancerRoutes);
    const isAdminRoute = isRouteMatch(pathname, adminRoutes);
    const isSharedProtectedRoute = isRouteMatch(pathname, sharedProtectedRoutes);

    const isProtectedRoute =
        isClientRoute ||
        isFreelancerRoute ||
        isAdminRoute ||
        isSharedProtectedRoute;

    // ----------------------------------------------------
    // 1. UNCOOKIED / UNAUTHENTICATED REQUESTS
    // ----------------------------------------------------
    if (!token) {
        // Verification pages require active session
        if (pathname === "/verify-email" || pathname === "/verify-identity") {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Protected routes require authentication
        if (isProtectedRoute) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    // ----------------------------------------------------
    // 2. JWT VERIFICATION
    // ----------------------------------------------------
    const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY;
    if (!jwtSecretKey) {
        console.error(
            "❌ [Proxy] JWT_TOKEN_SECRET_KEY is not defined in environment variables."
        );
        // If server configuration error, allow fail-safe redirect to login without crashing
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const encodedSecret = new TextEncoder().encode(jwtSecretKey);
        const { payload } = await jwtVerify(token, encodedSecret);
        const user = payload as TokenPayload;

        const role = (user.role || "").toLowerCase();
        const defaultDashboard = getDashboardUrlForRole(role);

        // ----------------------------------------------------
        // 3. EMAIL VERIFICATION CHECKS
        // ----------------------------------------------------
        if (!user.isEmailVerified) {
            if (pathname !== "/verify-email") {
                return NextResponse.redirect(new URL("/verify-email", request.url));
            }
            return NextResponse.next();
        }

        // ----------------------------------------------------
        // 4. IDENTITY VERIFICATION CHECKS
        // ----------------------------------------------------
        if (!user.isIdentityVerified) {
            if (pathname !== "/verify-identity") {
                return NextResponse.redirect(new URL("/verify-identity", request.url));
            }
            return NextResponse.next();
        }

        // ----------------------------------------------------
        // 5. PREVENT VERIFIED USERS FROM ACCESSING VERIFICATION PAGES
        // ----------------------------------------------------
        if (pathname === "/verify-email" || pathname === "/verify-identity") {
            return NextResponse.redirect(new URL(defaultDashboard, request.url));
        }

        // ----------------------------------------------------
        // 6. PREVENT AUTHENTICATED USERS FROM ACCESSING AUTH PAGES
        // ----------------------------------------------------
        if (isAuthRoute) {
            const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
            const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : defaultDashboard;
            return NextResponse.redirect(new URL(destination, request.url));
        }

        // ----------------------------------------------------
        // 7. ROLE-BASED ACCESS CONTROL
        // ----------------------------------------------------
        // Admin protection: Only ADMIN role can access /admin routes
        if (isAdminRoute && role !== UserRole.ADMIN && role !== "admin") {
            return NextResponse.redirect(new URL(defaultDashboard, request.url));
        }

        // Client route protection: FREELANCER cannot access /client
        if (isClientRoute && (role === UserRole.FREELANCER || role === "freelancer")) {
            return NextResponse.redirect(new URL(defaultDashboard, request.url));
        }

        // Freelancer route protection: CLIENT cannot access /freelancer
        if (isFreelancerRoute && (role === UserRole.CLIENT || role === "client")) {
            return NextResponse.redirect(new URL(defaultDashboard, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Invalid or expired token: clear cookie and redirect to login
        const loginUrl = new URL("/login", request.url);
        if (isProtectedRoute) {
            loginUrl.searchParams.set("callbackUrl", pathname);
        }

        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("token");
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

export { proxy as middleware };
export default proxy;