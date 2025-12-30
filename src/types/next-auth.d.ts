import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string; // Add this
    user: {
      id: string;
      role?: string;
      premium?: boolean;
      subscriptionType?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    premium?: boolean;
    subscriptionType?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    premium?: boolean;
    subscriptionType?: string | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number; // Add this
    error?: string; // Add this
  }
}