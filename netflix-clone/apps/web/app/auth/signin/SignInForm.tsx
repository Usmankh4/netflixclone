"use client";

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { signInUser, recordUserSignIn, getAuthErrorDetails } from '../../actions/auth';

/**
 * SignInForm Component (Client Component)
 * 
 * This component handles the interactive sign-in form functionality.
 * It's marked with "use client" since it uses React hooks and browser APIs.
 * It now integrates with server actions for enhanced validation and post-auth operations.
 */
const SignInForm: FC = () => {
  // Initialize Clerk's sign-in hook
  const { isLoaded, signIn, setActive } = useSignIn();
  
  // Get the router for navigation after sign-in
  const router = useRouter();
  
  // Get search params to handle redirects
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/browse';
  
  // State for form inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle form submission for sign-in
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Step 1: Server-side validation first
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      
      const validation = await signInUser(formData);
      
      if (validation.error) {
        setError(validation.error);
        setIsLoading(false);
        return;
      }
      
      // Step 2: Proceed with Clerk authentication
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // Step 3: Set the active session
        await setActive({ session: result.createdSessionId });
        
        // Step 4: Record the successful sign-in on the server
        if (result.createdSessionId) {
          await recordUserSignIn(result.createdSessionId);
        }
        
        // Step 5: Redirect to the appropriate page after sign-in
        router.push(redirectUrl);
      } else {
        // Handle additional steps if needed (e.g., 2FA)
        console.log('Additional verification steps required:', result);
        setError('Additional verification required. Please check your email.');
      }
    } catch (err: any) {
      // Enhanced error handling with server-side error details
      console.error('Sign-in error:', err);
      
      try {
        // Get more detailed error information from the server
        const formData = new FormData();
        formData.append("email", email);
        // Ensure we always have a string for errorMessage
        const errorMsg = typeof err.message === 'string' ? err.message : "Unknown error";
        formData.append("errorMessage", errorMsg);
        
        const errorDetails = await getAuthErrorDetails(formData);
        setError(errorDetails.message ?? (err.errors?.[0]?.message ?? 'Sorry, we can\'t find an account with this email address. Please try again or create a new account.'));
      } catch (detailsError) {
        // Fallback error handling if server action fails
        setError(err.errors?.[0]?.message ?? 'An error occurred during sign-in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form className="netflix-auth-form" onSubmit={handleSubmit}>
      {/* Display error message if there's an error */}
      {error && (
        <div className="netflix-auth-error">
          {error}
        </div>
      )}
      
      {/* Email input field */}
      <div className="netflix-auth-input-container">
        <input 
          type="email" 
          id="email" 
          className={`netflix-auth-input ${error ? 'error' : ''}`}
          placeholder=" " 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="email" className="netflix-auth-input-label">Email or phone number</label>
      </div>
      
      {/* Password input field */}
      <div className="netflix-auth-input-container">
        <input 
          type="password" 
          id="password" 
          className={`netflix-auth-input ${error ? 'error' : ''}`}
          placeholder=" " 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="password" className="netflix-auth-input-label">Password</label>
      </div>
      
      {/* Sign-in button */}
      <button 
        type="submit" 
        className="netflix-auth-submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      
      {/* Remember me checkbox and Need help link */}
      <div className="netflix-auth-form-help">
        <div className="netflix-auth-remember-me">
          <input 
            type="checkbox" 
            id="remember-me" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <Link href="#" className="netflix-auth-help-link">Need help?</Link>
      </div>
    </form>
  );
};

export default SignInForm;
