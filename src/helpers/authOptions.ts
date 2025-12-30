/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      // Fall back to old refresh token if backend doesn't rotate it
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken, 
      // Set expiration time (current time + 1 hour - 1 minute buffer)
      accessTokenExpires: Date.now() + 60 * 60 * 1000 - 60000, 
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        const result = await res.json();

        if (res.ok && result.data) {
          return {
            id: String(result.data.user.id),
            name: result.data.user.name,
            email: result.data.user.email,
            role: result.data.user.role,
            premium: result.data.user.premium,
            subscriptionType: result.data.user.subscriptionType,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 1. Initial Login
      if (account && user) {
        // Calculate expiration: Now + 1 hour (from backend logic)
        const expiresIn = 60 * 60 * 1000; 
        
        // Handle Google Login Sync
        if (account.provider === "google") {
           try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: token.email,
                  name: token.name,
                  image: token.picture,
                }),
              }
            );
            const result = await res.json();
            if (res.ok && result.data) {
              return {
                ...token,
                id: String(result.data.user.id),
                role: result.data.user.role,
                premium: result.data.user.premium,
                subscriptionType: result.data.user.subscriptionType,
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
                accessTokenExpires: Date.now() + expiresIn,
              };
            }
          } catch (error) {
            console.error("Google Sync Error:", error);
          }
        }

        // Handle Credentials Login (user object already has tokens from authorize)
        return {
          ...token,
          id: user.id,
          role: user.role,
          premium: user.premium,
          subscriptionType: user.subscriptionType,
          accessToken: user.accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + expiresIn,
        };
      }

      // 2. Return previous token if the access token has not expired yet
      // We assume `accessTokenExpires` exists. If not, we might trigger refresh or force logout
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 3. Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = String(token.id);
        session.user.role = token.role;
        session.user.premium = token.premium;
        session.user.subscriptionType = token.subscriptionType;
        session.accessToken = token.accessToken; // Valid, refreshed token
        session.error = token.error; // Pass error to client if refresh failed
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };