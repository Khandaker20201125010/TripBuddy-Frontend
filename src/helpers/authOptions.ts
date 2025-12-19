/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const result = await res.json();
        
        if (res.ok && result.data) {
          // ENSURE ID IS RETURNED HERE
          return {
            id: String(result.data.user.id), // Force to String immediately
            name: result.data.user.name,
            email: result.data.user.email,
            role: result.data.user.role,
            accessToken: result.data.accessToken,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 1. Initial Login (Credentials or Google)
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }

      // 2. Google Sync Logic
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
              image: token.picture,
            }),
          });
          const result = await res.json();
          if (res.ok && result.data) {
            token.accessToken = result.data.accessToken;
            token.id = String(result.data.user.id); // Force to String
            token.role = result.data.user.role;
          }
        } catch (error) {
          console.error("Google Sync Error:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        // MUST attach token.id to the session user object
        session.user.id = String(token.id); 
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };