/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

const loginValidationZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginTraveler = async (_currentState: any, formData: any) => {
  try {
    const redirectTo = formData.get("redirect") || null;

    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validated = loginValidationZodSchema.safeParse(loginData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    // Call backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
       credentials: "include",
    });

    const result = await res.json();

    if (!res.ok || !result?.data?.accessToken) {
      return { success: false, error: result?.message || "Login failed" };
    }

    const accessToken = result.data.accessToken;
    const refreshToken = result.data.refreshToken;

    // Set cookies
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: "/",
    });

    // Extract role
    const verified = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    if (typeof verified === "string") throw new Error("Invalid token payload");
    const userRole: UserRole = (verified as JwtPayload).role as UserRole;

    return {
      success: true,
      role: userRole,
      redirect: redirectTo || getDefaultDashboardRoute(userRole),
    };
  } catch (error: any) {
    console.error("Login Action Error:", error);
    return { success: false, error: error.message || "Login failed" };
  }
};
