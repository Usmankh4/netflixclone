/**
 * Clerk Configuration
 * 
 * This file contains configuration settings for Clerk authentication.
 * It defines the authentication routes and redirects for your Netflix clone.
 */

import { authMiddleware } from "@clerk/nextjs";
 
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
  "/api/webhook(.*)",
];

/**
 * Routes that are used for authentication
 * Users will be redirected to the sign-in page if they are not authenticated
 */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
];

/**
 * The route where users will be redirected after sign-in if no
 * specific redirect URL is provided
 */
export const signInRedirectUrl = "/browse";

/**
 * The route where users will be redirected after sign-out
 */
export const signOutRedirectUrl = "/";

/**
 * Clerk middleware configuration
 * This middleware protects routes and handles authentication redirects
 */
export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ["/api/webhook(.*)"],
  afterAuth(auth, req, evt) {
    // Handle authentication redirects
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

    // If the user is not signed in and the route is not public or auth, redirect to sign-in
    if (!auth.userId && !isPublicRoute && !isAuthRoute) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return Response.redirect(signInUrl);
    }

    // If the user is signed in and trying to access an auth route, redirect to browse
    if (auth.userId && isAuthRoute) {
      const browseUrl = new URL(signInRedirectUrl, req.url);
      return Response.redirect(browseUrl);
    }

    // Continue with the request
    return;
  },
});
