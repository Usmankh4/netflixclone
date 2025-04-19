"use server";

import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Server action to sign in a user
 * This leverages SSR for improved security and performance
 */
export async function signInUser(formData: FormData) {
  try {
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Validate inputs
    if (!email || !password) {
      return {
        error: "Email and password are required"
      };
    }
    
    // Note: In a true SSR implementation, we would use Clerk's server-side APIs
    // However, Clerk's passwordless sign-in flow requires client-side components
    // This is a limitation of the current Clerk implementation
    
    // For now, we'll return the validated data to be processed by a client component
    return {
      success: true,
      email,
      password
    };
  } catch (error: any) {
    console.error("Server action error:", error);
    return {
      error: error.message || "An error occurred during sign-in"
    };
  }
}


export async function signUpUser(formData: FormData) {
  try {
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      return {
        error: "All fields are required"
      };
    }
    
    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match"
      };
    }
    
    return {
      success: true,
      email,
      password
    };
  } catch (error: any) {
    console.error("Server action error:", error);
    return {
      error: error.message || "An error occurred during sign-up"
    };
  }
}


export async function getCurrentUser() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return null;
    }
    
    const user = await clerkClient.users.getUser(userId);
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}


export async function checkAuth() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/auth/signin");
  }
  
  return userId;
}

/**
 * Server action to record a successful user sign-in
 * This allows for additional server-side operations after authentication
 */
export async function recordUserSignIn(sessionId: string) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return {
        error: "No authenticated user found"
      };
    }
    
    // Log the sign-in event (you could store this in a database)
    console.log(`User ${userId} signed in successfully with session ${sessionId} at ${new Date().toISOString()}`);
    
    // You could perform additional operations here:
    // - Update last login timestamp in your database
    // - Record the sign-in IP address for security monitoring
    // - Update user analytics
    
    return {
      success: true,
      userId
    };
  } catch (error: any) {
    console.error("Error recording sign-in:", error);
    return {
      error: error.message || "Failed to record sign-in"
    };
  }
}

/**
 * Server action to get detailed authentication error information
 * This provides better error messages to the client
 */
export async function getAuthErrorDetails(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const errorMessage = formData.get("errorMessage") as string;
    
    // Here you could implement custom error handling logic:
    // - Check if the email exists in your database
    // - Determine if the account is locked
    // - Provide more specific error messages
    
    // For demonstration, we'll provide more user-friendly error messages
    if (errorMessage.includes("password")) {
      return {
        message: "The password you entered is incorrect. Please try again."
      };
    } else if (errorMessage.includes("identifier")) {
      return {
        message: "We couldn't find an account with that email. Please check your email or create a new account."
      };
    } else if (errorMessage.includes("rate")) {
      return {
        message: "Too many sign-in attempts. Please try again later or reset your password."
      };
    }
    
    // Default error message
    return {
      message: "An error occurred during sign-in. Please try again."
    };
  } catch (error: any) {
    console.error("Error getting auth error details:", error);
    return {
      message: "An unexpected error occurred. Please try again later."
    };
  }
}
