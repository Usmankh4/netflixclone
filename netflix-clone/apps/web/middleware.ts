/**
 * Clerk Middleware Configuration
 * 
 * This file sets up authentication middleware for the Netflix clone.
 * It defines which routes require authentication and handles redirects.
 */

import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
/**
 * Routes that can be accessed without authentication
 * - / : Homepage
 * - /auth/* : All authentication-related pages
 * - /api/webhook/* : Webhook endpoints for external services
 */
export const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-email",
  "/api/webhook(.*)",
];

/**
 * Routes that are used for authentication
 * Users will be redirected to the sign-in page if they are not authenticated
 */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-email",
];

/**
 * Clerk middleware configuration
 * This middleware protects routes and handles authentication redirects
 */
export default authMiddleware({
  // Routes that can be accessed without authentication
  publicRoutes,
  
  // Routes to ignore (webhooks don't need authentication checks)
  ignoredRoutes: ["/api/webhook(.*)"],
  
  // Function that runs after Clerk's authentication check
  afterAuth: async (auth, req, evt) => {
    // Get the current URL path
    const path = req.nextUrl.pathname;
    
    // Check if the current route is public or an auth route
    const isPublicRoute = publicRoutes.some(pattern => {
      if (pattern.includes("(.*)")) {
        const regex = new RegExp(pattern.replace("(.*)", ".*"));
        return regex.test(path);
      }
      return path === pattern;
    });
    const isAuthRoute = authRoutes.includes(path);

    // Enhanced SSR support: Pre-fetch user data for authenticated routes
    if (auth.userId && !isAuthRoute) {
      try {
        // Pre-fetch user data to make it available for SSR
        // This reduces client-side data fetching
        await clerkClient.users.getUser(auth.userId);
      } catch (error) {
        console.error("Error pre-fetching user data:", error);
      }
    }

    // If the user is not signed in and the route is protected, redirect to sign-in
    if (!auth.userId && !isPublicRoute) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If the user is signed in and trying to access an auth route, redirect to browse
    if (auth.userId && isAuthRoute) {
      const browseUrl = new URL("/browse", req.url);
      return NextResponse.redirect(browseUrl);
    }

    // Continue with the request
    return NextResponse.next();
  },
});

// Configure Middleware to run on all routes except static files and API routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
