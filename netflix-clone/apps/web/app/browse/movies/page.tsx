import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../actions/auth';
import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { prisma } from '../../../lib/prisma';
import Image from 'next/image';

// Import the UserButton component dynamically to avoid TypeScript errors
const ClientSideButton = dynamic(
  () => import('../../components/ClientSideButton'),
  {
    ssr: false,
    loading: () => <div className="loading-button">Loading...</div>
  }
);

// Import the AddToFavoritesButton component dynamically
const AddToFavoritesButton = dynamic(
  () => import('../../components/AddToFavoritesButton'),
  {
    ssr: false,
    loading: () => <div className="loading-button-small">...</div>
  }
);

export const metadata: Metadata = {
  title: 'Netflix Clone - Movies',
  description: 'Browse movies on Netflix Clone.',
};

/**
 * Movies Component (Server Component)
 * 
 * This is the movies page of the Netflix clone.
 * It uses Server-Side Rendering for improved performance and SEO.
 * This page is protected and only accessible to authenticated users.
 */
export default async function Movies(): Promise<ReactElement> {
  // Server-side authentication check
  const { userId } = auth();
  
  // If user is not authenticated, redirect to sign in page
  if (!userId) {
    redirect('/auth/signin');
  }
  
  // Get current user data (server-side)
  const user = await getCurrentUser();
  
  // Get user from database using Clerk ID or create if it doesn't exist
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId as string },
  });
  
  // If user doesn't exist in database, create a new user
  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId as string,
          email: user?.emailAddress || '',
          name: user?.firstName || 'Netflix User',
        },
      });
      
      // Create a default profile for the user
      await prisma.profile.create({
        data: {
          userId: dbUser.id,
          name: 'Default Profile',
          imageUrl: 'https://i.pravatar.cc/150?u=' + dbUser.id,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return (
        <div className="error-container">
          <h1>Error creating user</h1>
          <p>There was an error setting up your account. Please try again or contact support.</p>
        </div>
      );
    }
  }
  
  // Get the user's active profile
  let profile = await prisma.profile.findFirst({
    where: { userId: dbUser.id },
    include: {
      favorites: true,
    },
  });
  
  // If profile doesn't exist, create a default profile
  if (!profile) {
    try {
      profile = await prisma.profile.create({
        data: {
          userId: dbUser.id,
          name: 'Default Profile',
          imageUrl: 'https://i.pravatar.cc/150?u=' + dbUser.id,
        },
        include: {
          favorites: true,
        },
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      return (
        <div className="error-container">
          <h1>Error creating profile</h1>
          <p>There was an error setting up your profile. Please try again or contact support.</p>
        </div>
      );
    }
  }
  
  // Create a set of favorited video IDs for quick lookup
  const favoritedVideoIds = new Set(profile.favorites.map(video => video.id));
  
  // Fetch real data from the database
  const trendingMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE',
      trending: true 
    },
    take: 10,
  });
  
  // Get movies with highest average rating
  const popularMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE'
    },
    take: 10,
    orderBy: {
      averageRating: 'desc'
    }
  });
  
  // Get action movies
  const actionMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE',
      genre: {
        has: 'Action'
      }
    },
    take: 10,
  });
  
  // Get drama movies
  const dramaMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE',
      genre: {
        has: 'Drama'
      }
    },
    take: 10,
  });
  
  // Get comedy movies
  const comedyMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE',
      genre: {
        has: 'Comedy'
      }
    },
    take: 10,
  });
  
  // Get a random featured movie for the hero banner
  const featuredMovies = await prisma.video.findMany({
    where: { 
      type: 'MOVIE',
      featured: true 
    },
    take: 10,
  });
  
  const featuredContent = featuredMovies.length > 0 
    ? featuredMovies[Math.floor(Math.random() * featuredMovies.length)]
    : null;
  
  // Get banner image for the featured content
  const bannerImage = featuredContent 
    ? await prisma.imageAsset.findFirst({
        where: { 
          key: { contains: featuredContent.title.toLowerCase().replace(/\s+/g, '-') },
          type: 'BANNER'
        }
      })
    : null;
  
  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="browse-container">
      <header className="browse-header">
        <div className="header-content">
          <div className="logo-container">
            <Link href="/browse" className="logo-link">
              <span className="netflix-logo">NETFLIX</span>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul className="nav-links">
              <li className="nav-item">
                <Link href="/browse" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/series" className="nav-link">
                  TV Shows
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/movies" className="nav-link active">
                  Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/new" className="nav-link">
                  New & Popular
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/my-list" className="nav-link">
                  My List
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <div className="search-box">
              <button className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {user && <ClientSideButton user={user} />}
          </div>
        </div>
      </header>
      
      <main className="browse-main">
        {/* Hero Banner */}
        {featuredContent && (
          <section 
            className="hero-banner" 
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${bannerImage?.url || featuredContent.thumbnailUrl})` 
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{featuredContent.title}</h1>
              <div className="hero-meta">
                <span className="hero-year">{featuredContent.releaseYear}</span>
                <span className="hero-rating">{featuredContent.maturityRating}</span>
                {featuredContent.duration && (
                  <span className="hero-duration">{formatDuration(featuredContent.duration)}</span>
                )}
              </div>
              <p className="hero-description">{featuredContent.description}</p>
              <div className="hero-actions">
                <button className="play-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                  </svg>
                  Play
                </button>
                <button className="more-info-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  More Info
                </button>
              </div>
            </div>
          </section>
        )}
        
        {/* Genre Filter */}
        <section className="genre-filter">
          <div className="filter-container">
            <h2 className="filter-title">Movies</h2>
            <div className="filter-dropdown">
              <button className="filter-button">
                Genres
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
        
        {/* Content Rows */}
        {trendingMovies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Trending Movies</h2>
            <div className="content-row">
              {trendingMovies.map((item) => (
                <div key={item.id} className="content-card">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="content-image"
                    width={300}
                    height={450}
                  />
                  <div className="content-overlay">
                    <h3 className="content-title">{item.title}</h3>
                    <div className="content-actions">
                      <button className="content-play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <AddToFavoritesButton 
                        profileId={profile.id} 
                        videoId={item.id} 
                        isFavorited={favoritedVideoIds.has(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {popularMovies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Popular Movies</h2>
            <div className="content-row">
              {popularMovies.map((item) => (
                <div key={item.id} className="content-card">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="content-image"
                    width={300}
                    height={450}
                  />
                  <div className="content-overlay">
                    <h3 className="content-title">{item.title}</h3>
                    <div className="content-actions">
                      <button className="content-play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <AddToFavoritesButton 
                        profileId={profile.id} 
                        videoId={item.id} 
                        isFavorited={favoritedVideoIds.has(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {actionMovies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Action Movies</h2>
            <div className="content-row">
              {actionMovies.map((item) => (
                <div key={item.id} className="content-card">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="content-image"
                    width={300}
                    height={450}
                  />
                  <div className="content-overlay">
                    <h3 className="content-title">{item.title}</h3>
                    <div className="content-actions">
                      <button className="content-play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <AddToFavoritesButton 
                        profileId={profile.id} 
                        videoId={item.id} 
                        isFavorited={favoritedVideoIds.has(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {dramaMovies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Drama Movies</h2>
            <div className="content-row">
              {dramaMovies.map((item) => (
                <div key={item.id} className="content-card">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="content-image"
                    width={300}
                    height={450}
                  />
                  <div className="content-overlay">
                    <h3 className="content-title">{item.title}</h3>
                    <div className="content-actions">
                      <button className="content-play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <AddToFavoritesButton 
                        profileId={profile.id} 
                        videoId={item.id} 
                        isFavorited={favoritedVideoIds.has(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {comedyMovies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Comedy Movies</h2>
            <div className="content-row">
              {comedyMovies.map((item) => (
                <div key={item.id} className="content-card">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="content-image"
                    width={300}
                    height={450}
                  />
                  <div className="content-overlay">
                    <h3 className="content-title">{item.title}</h3>
                    <div className="content-actions">
                      <button className="content-play-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <AddToFavoritesButton 
                        profileId={profile.id} 
                        videoId={item.id} 
                        isFavorited={favoritedVideoIds.has(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <footer className="browse-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" className="footer-link">Terms of Use</a>
            <a href="#" className="footer-link">Privacy Statement</a>
            <a href="#" className="footer-link">Cookie Preferences</a>
            <a href="#" className="footer-link">Help Center</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Netflix Clone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
