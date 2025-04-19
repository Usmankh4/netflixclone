import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getCurrentUser } from './actions/auth';
import { Metadata } from 'next';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

// Use a type-only import to define the component type
type ClientSideButtonProps = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string | undefined;
    imageUrl: string;
  };
};

// Import the component dynamically to avoid TypeScript errors
// This is a common pattern for client components in server components
const ClientSideButton = dynamic(
  () => import('./components/ClientSideButton'),
  {
    ssr: false,
    loading: () => <div className="loading-button">Loading...</div>
  }
);

export const metadata: Metadata = {
  title: 'Netflix Clone - Home',
  description: 'Watch movies and TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
};

/**
 * Home Component (Server Component)
 * 
 * This is the main landing page of the Netflix clone.
 * It uses Server-Side Rendering for improved performance and SEO.
 */
export default async function Home(): Promise<ReactElement> {
  // Server-side authentication check
  const { userId } = auth();
  
  // Get current user data if authenticated (server-side)
  const user = userId ? await getCurrentUser() : null;
  
  return (
    <div className="netflix-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <Link href="/" className="logo-link">
              <span className="netflix-logo">NETFLIX</span>
            </Link>
          </div>
          <div className="auth-buttons">
            {user ? (
              <ClientSideButton user={user} />
            ) : (
              <Link href="/auth/signin" className="signin-button">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Unlimited movies, TV shows, and more</h1>
            <h2 className="hero-subtitle">Watch anywhere. Cancel anytime.</h2>
            <p className="hero-text">Ready to watch? Enter your email to create or restart your membership.</p>
            <div className="cta-form">
              <Link href="/auth/signup" className="cta-button">Get Started</Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="feature">
            <div className="feature-text">
              <h2 className="feature-title">Enjoy on your TV</h2>
              <p className="feature-description">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
            </div>
            <div className="feature-image-container">
              <div className="feature-image-placeholder tv-image"></div>
            </div>
          </div>

          <div className="feature reverse">
            <div className="feature-text">
              <h2 className="feature-title">Download your shows to watch offline</h2>
              <p className="feature-description">Save your favorites easily and always have something to watch.</p>
            </div>
            <div className="feature-image-container">
              <div className="feature-image-placeholder mobile-image"></div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-text">
              <h2 className="feature-title">Watch everywhere</h2>
              <p className="feature-description">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
            </div>
            <div className="feature-image-container">
              <div className="feature-image-placeholder devices-image"></div>
            </div>
          </div>
          
          <div className="feature reverse">
            <div className="feature-text">
              <h2 className="feature-title">Create profiles for kids</h2>
              <p className="feature-description">Send kids on adventures with their favorite characters in a space made just for them—free with your membership.</p>
            </div>
            <div className="feature-image-container">
              <div className="feature-image-placeholder kids-image"></div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">Questions? Contact us.</p>
          <div className="footer-links">
            <Link href="#" className="footer-link">FAQ</Link>
            <Link href="#" className="footer-link">Help Center</Link>
            <Link href="#" className="footer-link">Account</Link>
            <Link href="#" className="footer-link">Media Center</Link>
            <Link href="#" className="footer-link">Investor Relations</Link>
            <Link href="#" className="footer-link">Jobs</Link>
            <Link href="#" className="footer-link">Ways to Watch</Link>
            <Link href="#" className="footer-link">Terms of Use</Link>
            <Link href="#" className="footer-link">Privacy</Link>
            <Link href="#" className="footer-link">Cookie Preferences</Link>
            <Link href="#" className="footer-link">Corporate Information</Link>
            <Link href="#" className="footer-link">Contact Us</Link>
          </div>
          <p className="copyright">Netflix Clone &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
