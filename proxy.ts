import { jwtVerify, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./utils/enums.utils";

const secret = new TextEncoder().encode(
    process.env.JWT_TOKEN_SECRET_KEY
);

interface TokenPayload extends JWTPayload {
    email: string;
    role: "client" | "freelancer";
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
}

const clientRoutes = [
    "/client",
];

const freelancerRoutes = [
    "/freelancer",
];

const adminRoutes = [
    "/admin",
];

const sharedProtectedRoutes = [
    "/profile",
    "/settings",
    "/jobs"
];

const authRoutes = [
    "/login",
    "/register",
    "/verify-email",
    "/verify-identity",
    "/forgot-password",
    "/reset-password",
];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isClientRoute = clientRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isFreelancerRoute = freelancerRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
    );



    const isSharedProtectedRoute = sharedProtectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isProtectedRoute =
        isClientRoute ||
        isFreelancerRoute ||
        isAdminRoute ||
        isSharedProtectedRoute;

    // --------------------------------
    // No token
    // --------------------------------

    if (!token) {
        // Verification pages require authentication
        if (
            pathname === "/verify-email" ||
            pathname === "/verify-identity"
        ) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Protected routes require authentication
        if (isProtectedRoute) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        return NextResponse.next();
    }

    // --------------------------------
    // Verify JWT
    // --------------------------------

    try {
        const { payload } = await jwtVerify(
            token,
            secret
        );

        const user = payload as TokenPayload;

        // --------------------------------
        // 1. EMAIL VERIFICATION
        // --------------------------------

        if (!user.isEmailVerified) {
            if (pathname !== "/verify-email") {
                return NextResponse.redirect(
                    new URL("/verify-email", request.url)
                );
            }

            // Allow verify-email page
            return NextResponse.next();
        }

        // --------------------------------
        // 2. IDENTITY VERIFICATION
        // --------------------------------

        if (!user.isIdentityVerified) {
            if (pathname !== "/verify-identity") {
                return NextResponse.redirect(
                    new URL("/verify-identity", request.url)
                );
            }

            // Allow verify-identity page
            return NextResponse.next();
        }

        // --------------------------------
        // 3. BOTH VERIFIED
        // --------------------------------

        // Verified users cannot access
        // verification pages anymore.
        if (
            pathname === "/verify-email" ||
            pathname === "/verify-identity"
        ) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        // --------------------------------
        // 4. AUTH PAGES
        // --------------------------------

        if (isAuthRoute) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        // --------------------------------
        // 5. ROLE PROTECTION
        // --------------------------------

        // Client cannot access freelancer routes
        if (
            user.role == UserRole.CLIENT &&
            isFreelancerRoute
        ) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        // Freelancer cannot access client routes
        if (
            user.role == UserRole.FREELANCER &&
            isClientRoute
        ) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        return NextResponse.next();

    } catch (error) {
        console.error("JWT verification failed:", error);

        const response = NextResponse.redirect(
            new URL("/login", request.url)
        );

        response.cookies.delete("token");

        return response;
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};