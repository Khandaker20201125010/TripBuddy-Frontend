// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      premium?: boolean; // Added this
      subscriptionType?: string | null; // Added this
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    premium?: boolean; // Added this
    subscriptionType?: string | null; // Added this
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    premium?: boolean; // Added this
    subscriptionType?: string | null; // Added this
    accessToken?: string;
  }
}