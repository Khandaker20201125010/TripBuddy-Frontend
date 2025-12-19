
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Import this
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./services/auth/auth-utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./services/auth/tokenHandlers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Initialize Role and Auth Status
  let userRole: UserRole | null = null;
  let isAuthenticated = false;

  // ----------------------------------------------------------------
  // STRATEGY A: Check Custom Cookie (Email/Password Login)
  // ----------------------------------------------------------------
  const accessToken = await getCookie("accessToken");

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload | string;

      if (typeof verifiedToken !== "string") {
        userRole = verifiedToken.role as UserRole;
        isAuthenticated = true;
      }
    } catch (error) {
      // Token is invalid/expired
      console.error("Invalid custom access token", error);
    }
  }

  // ----------------------------------------------------------------
  // STRATEGY B: Check NextAuth Session (Google Login)
  // Only check if not already authenticated via custom cookie
  // ----------------------------------------------------------------
  if (!isAuthenticated) {
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (nextAuthToken) {
      userRole = nextAuthToken.role as UserRole;
      isAuthenticated = true;
    }
  }

  // ----------------------------------------------------------------
  // ROUTE PROTECTION LOGIC
  // ----------------------------------------------------------------
  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1 : User is logged in and trying to access auth route (e.g., /login)
  if (isAuthenticated && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
    );
  }

  // Rule 2 : User is trying to access open public route (e.g., /about)
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // Rule 3 : Protected Routes - If not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    // If we had a bad custom token, clean it up
    if (accessToken) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    return NextResponse.redirect(loginUrl);
  }

  // Rule 4 : User is trying to access common protected route
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 5 : User is trying to access role-based protected route
  if (routeOwner === "ADMIN" || routeOwner === "USER") {
    if (userRole !== routeOwner) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};