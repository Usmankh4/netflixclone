"use client";

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';

/**
 * SignUp Component
 * 
 * This component handles user registration using Clerk.
 * It includes:
 * - Email and password registration form
 * - Password confirmation
 * - Error handling for registration failures
 * - Redirect after successful sign-up
 */
const SignUp: FC = () => {
  // Initialize Clerk's sign-up hook
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Get the router for navigation after sign-up
  const router = useRouter();
  
  // State for form inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle form submission for sign-up
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Attempt to create a new account
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      
      // Prepare verification (if email verification is enabled)
      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        // Redirect to the browse page
        router.push('/browse');
      } else {
        // Email verification might be required
        const verificationStatus = await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        
        if (verificationStatus.status === 'complete') {
          // Email verification is complete, set active session
          await setActive({ session: result.createdSessionId });
          router.push('/browse');
        } else {
          // Email verification is required
          router.push('/auth/verify-email');
        }
      }
    } catch (err: any) {
      // Handle sign-up errors
      console.error('Sign-up error:', err);
      setError(err.errors?.[0]?.message || 'An error occurred during sign-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <header className="netflix-auth-header">
        <Link href="/" className="netflix-logo">NETFLIX</Link>
      </header>

      <main className="netflix-auth-main">
        <div className="netflix-auth-form-container">
          <h1 className="netflix-auth-title">Sign Up</h1>
          
          {/* Display error message if there's an error */}
          {error && (
            <div className="netflix-auth-error">
              {error}
            </div>
          )}
          
          {/* Sign-up form */}
          <form className="netflix-auth-form" onSubmit={handleSubmit}>
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
              <label htmlFor="email" className="netflix-auth-input-label">Email</label>
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
              <label htmlFor="password" className="netflix-auth-input-label">Add a password</label>
            </div>
            
            {/* Confirm Password input field */}
            <div className="netflix-auth-input-container">
              <input 
                type="password" 
                id="confirm-password" 
                className={`netflix-auth-input ${error ? 'error' : ''}`}
                placeholder=" " 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <label htmlFor="confirm-password" className="netflix-auth-input-label">Confirm password</label>
            </div>
            
            {/* Sign-up button */}
            <button 
              type="submit" 
              className="netflix-auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          
          {/* Already have an account section */}
          <div className="netflix-auth-signup-text">
            Already have an account? <Link href="/auth/signin" className="netflix-auth-signup-link">Sign in now</Link>
          </div>
          
          {/* Terms of use and privacy policy */}
          <div className="netflix-auth-captcha-text">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot. <Link href="#" className="netflix-auth-help-link">Learn more.</Link>
          </div>
        </div>
      </main>
      
      <footer className="netflix-auth-footer">
        <div className="netflix-auth-footer-content">
          <div className="netflix-auth-footer-top">
            <p>Questions? Call 1-844-505-2993</p>
          </div>
          
          <div className="netflix-auth-footer-links">
            <Link href="#" className="netflix-auth-footer-link">FAQ</Link>
            <Link href="#" className="netflix-auth-footer-link">Help Center</Link>
            <Link href="#" className="netflix-auth-footer-link">Terms of Use</Link>
            <Link href="#" className="netflix-auth-footer-link">Privacy</Link>
            <Link href="#" className="netflix-auth-footer-link">Cookie Preferences</Link>
            <Link href="#" className="netflix-auth-footer-link">Corporate Information</Link>
          </div>
          
          <div className="netflix-auth-language-selector">
            <span className="netflix-auth-language-icon">🌐</span>
            <select className="netflix-auth-language-select">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <span className="netflix-auth-language-arrow">▼</span>
          </div>
          
          <div className="netflix-auth-footer-copy">
            1997-2025 Netflix, Inc.
          </div>
        </div>
      </footer>
    </>
  );
};

export default SignUp;
