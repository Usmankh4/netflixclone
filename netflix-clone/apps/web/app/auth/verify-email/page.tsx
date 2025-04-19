"use client";

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';

/**
 * VerifyEmail Component
 * 
 * This component handles email verification during the sign-up process.
 * It includes:
 * - Input field for verification code
 * - Verification code submission
 * - Error handling for verification failures
 * - Redirect after successful verification
 */
const VerifyEmail: FC = () => {
  // Initialize Clerk's sign-up hook
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Get the router for navigation after verification
  const router = useRouter();
  
  // State for verification code, errors, and loading state
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle verification code submission
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) {
      setError('Verification session expired. Please sign up again.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Attempt to verify the email with the provided code
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      // Check if verification was successful
      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        // Redirect to the browse page
        router.push('/browse');
      } else {
        // Handle incomplete verification
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      // Handle verification errors
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle resending the verification code
   */
  const handleResendCode = async () => {
    if (!isLoaded || !signUp) {
      setError('Verification session expired. Please sign up again.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Resend the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      
      // Show success message
      setError('Verification code resent. Please check your email.');
    } catch (err: any) {
      // Handle resend errors
      console.error('Resend code error:', err);
      setError(err.errors?.[0]?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="signin-container">
      {/* Header with Netflix logo */}
      <header className="auth-header">
        <div className="auth-header-content">
          <Link href="/" className="auth-logo-container">
            <span className="netflix-logo">NETFLIX</span>
          </Link>
        </div>
      </header>

      {/* Main content with verification form */}
      <main className="auth-main">
        <div className="auth-form-container">
          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">We've sent a verification code to your email. Please enter it below to complete your registration.</p>
          
          {/* Display error message if there's an error */}
          {error && (
            <div className={error.includes('resent') ? 'auth-success' : 'auth-error'}>
              {error}
            </div>
          )}
          
          {/* Verification form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Verification code input field */}
            <div className="auth-input-container">
              <input 
                type="text" 
                id="verification-code" 
                className="auth-input" 
                placeholder=" " 
                required 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
              />
              <label htmlFor="verification-code" className="auth-input-label">Verification Code</label>
            </div>
            
            {/* Verify button */}
            <button 
              type="submit" 
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          
          {/* Resend code section */}
          <div className="auth-resend-code">
            <p>Didn't receive a code? 
              <button 
                onClick={handleResendCode} 
                className="auth-resend-button"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </p>
          </div>
          
          {/* Back to sign-in */}
          <div className="auth-existing-user">
            <p>Want to try again? <Link href="/auth/signup" className="auth-signin-link">Sign up</Link>.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
