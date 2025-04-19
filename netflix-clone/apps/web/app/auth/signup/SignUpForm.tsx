"use client";

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';

/**
 * SignUpForm Component (Client Component)
 * 
 * This component handles the interactive sign-up form functionality.
 * It's marked with "use client" since it uses React hooks and browser APIs.
 */
const SignUpForm: FC = () => {
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
    
    // Validate password match
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
      
      // Start the email verification process
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Redirect to the verification page
      router.push('/auth/verify-email');
    } catch (err: any) {
      // Handle sign-up errors
      console.error('Sign-up error:', err);
      setError(err.errors?.[0]?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Email input field */}
      <div className="auth-input-container">
        <input 
          type="email" 
          id="email" 
          className="auth-input" 
          placeholder=" " 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="email" className="auth-input-label">Email</label>
      </div>
      
      {/* Password input field */}
      <div className="auth-input-container">
        <input 
          type="password" 
          id="password" 
          className="auth-input" 
          placeholder=" " 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="password" className="auth-input-label">Password</label>
      </div>
      
      {/* Confirm Password input field */}
      <div className="auth-input-container">
        <input 
          type="password" 
          id="confirm-password" 
          className="auth-input" 
          placeholder=" " 
          required 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="confirm-password" className="auth-input-label">Confirm Password</label>
      </div>
      
      {/* Sign-up button */}
      <button 
        type="submit" 
        className="auth-submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
      
      {/* Display error message if there's an error */}
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
