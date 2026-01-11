// app/api/auth/[...nextauth]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.refreshToken}`,
        },
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error(refreshedTokens.message || "Failed to refresh token");
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000 - 60000,
      image: refreshedTokens.data.user?.profileImage || token.image,
      picture: refreshedTokens.data.user?.profileImage || token.picture || token.image,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// ADD THIS FUNCTION TO UPDATE USER DATA
async function updateUserData(token: JWT) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${token.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.data) {
      return {
        ...token,
        image: result.data.profileImage,
        picture: result.data.profileImage,
        name: result.data.name,
        premium: result.data.premium,
        subscriptionType: result.data.subscriptionType,
      };
    }
    return token;
  } catch (error) {
    console.error("Failed to update user data:", error);
    return token;
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.message || "Login failed");
          }

          if (res.ok && result.data) {
            return {
              id: String(result.data.user.id),
              name: result.data.user.name,
              email: result.data.user.email,
              role: result.data.user.role,
              premium: result.data.user.premium,
              subscriptionType: result.data.user.subscriptionType,
              image: result.data.user.profileImage,
              picture: result.data.user.profileImage, // Ensure picture is set
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Authorize error:", error);
          if (error.message.includes("Network")) {
            throw new Error("Network error. Please check your connection.");
          }
          throw new Error(error.message || "Login failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // NEW: Handle session update when profile is edited
      if (trigger === "update") {
        // Update token with new session data
        return {
          ...token,
          ...session.user,
          image: session.user.image || token.image,
          picture: session.user.image || token.picture,
        };
      }

      // 1. Initial Login
      if (account && user) {
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
                image: result.data.user.profileImage,
                picture: result.data.user.profileImage || token.picture,
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
                accessTokenExpires: Date.now() + expiresIn,
              };
            } else {
              throw new Error(result.message || "Google login failed");
            }
          } catch (error: any) {
            console.error("Google Sync Error:", error);
            throw new Error(error.message || "Google login failed");
          }
        }

        // Handle Credentials Login
        return {
          ...token,
          id: user.id,
          role: user.role,
          premium: user.premium,
          subscriptionType: user.subscriptionType,
          image: (user as any).image,
          picture: (user as any).image, // Make sure picture is set
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + expiresIn,
        };
      }

      // 2. Check if token needs refresh
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        // Periodically update user data (every 5 minutes)
        if (Date.now() - (token.lastUpdated as number || 0) > 5 * 60 * 1000) {
          const updatedToken = await updateUserData(token);
          return {
            ...updatedToken,
            lastUpdated: Date.now(),
          };
        }
        return token;
      }

      // 3. Refresh token if expired
      const refreshedToken = await refreshAccessToken(token);
      // Update user data after refresh
      const updatedToken = await updateUserData(refreshedToken);
      return {
        ...updatedToken,
        lastUpdated: Date.now(),
      };
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = String(token.id);
        session.user.role = token.role;
        session.user.premium = token.premium;
        session.user.subscriptionType = token.subscriptionType;
        session.user.image = token.image || token.picture; // Use image or picture
        session.user.name = token.name;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  // ADD THIS: Enable session updates
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };