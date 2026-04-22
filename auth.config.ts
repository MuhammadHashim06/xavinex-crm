import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiRoute = nextUrl.pathname.startsWith("/api/auth");
      const isLoginPage = nextUrl.pathname === "/login";

      if (isApiRoute) return true;

      if (!isLoggedIn && !isLoginPage) {
        return false; // Redirect to login
      }
      
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
