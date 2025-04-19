"use server";

import { FC } from 'react';
import Link from 'next/link';
import SignInForm from './SignInForm';

/**
 * SignIn Page Component (Server Component)
 * 
 * This component renders the sign-in page using Server-Side Rendering.
 * It delegates the interactive form handling to a Client Component.
 */
const SignInPage: FC = () => {
  return (
    <>
      <header className="netflix-auth-header">
        <Link href="/" className="netflix-logo">NETFLIX</Link>
      </header>
      
      <main className="netflix-auth-main">
        <div className="netflix-auth-form-container">
          <h1 className="netflix-auth-title">Sign In</h1>
          
          <SignInForm />
          
          <div className="netflix-auth-signup-text">
            New to Netflix? <Link href="/auth/signup" className="netflix-auth-signup-link">Sign up now</Link>
          </div>
          
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

export default SignInPage;
