import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../actions/auth';
import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { prisma } from '../../../lib/prisma';

const ClientSideButton = dynamic(
  () => import('../../components/ClientSideButton'),
  {
    ssr: false,
    loading: () => <div className="loading-button">Loading...</div>
  }
);


const AddToFavoritesButton = dynamic(
  () => import('../../components/AddToFavoritesButton'),
  {
    ssr: false,
    loading: () => <div className="loading-button-small">...</div>
  }
);

export const metadata: Metadata = {
  title: 'Netflix Clone - TV Shows',
  description: 'Browse TV shows on Netflix Clone.',
};


export default async function Series(): Promise<ReactElement> {
  
  const { userId } = auth();
  
  if (!userId) {
    redirect('/auth/signin');
  }
  
  const user = await getCurrentUser();
  
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId as string },
  });
  
  if (!dbUser) {
    return (
      <div className="error-container">
        <h1>User not found</h1>
        <p>Please sign in again or contact support.</p>
      </div>
    );
  }
  
 
  const profile = await prisma.profile.findFirst({
    where: { userId: dbUser.id },
    include: {
      favorites: true,
    },
  });
  
  if (!profile) {
    return (
      <div className="error-container">
        <h1>Profile not found</h1>
        <p>Please create a profile to continue.</p>
      </div>
    );
  }
  
  const favoritedVideoIds = new Set(profile.favorites.map(video => video.id));
  
  const trendingTVShows = await prisma.video.findMany({
    where: { 
      type: 'SERIES',
      trending: true 
    },
    take: 10,
  });
  
  const popularTVShows = await prisma.video.findMany({
    where: { 
      type: 'SERIES'
    },
    take: 10,
    orderBy: {
      averageRating: 'desc'
    }
  });
  
  const dramaTVShows = await prisma.video.findMany({
    where: { 
      type: 'SERIES',
      genre: {
        has: 'Drama'
      }
    },
    take: 10,
  });
  
  const comedyTVShows = await prisma.video.findMany({
    where: { 
      type: 'SERIES',
      genre: {
        has: 'Comedy'
      }
    },
    take: 10,
  });
  
  const featuredTVShows = await prisma.video.findMany({
    where: { 
      type: 'SERIES',
      featured: true 
    },
    take: 10,
  });
  
  const featuredContent = featuredTVShows.length > 0 
    ? featuredTVShows[Math.floor(Math.random() * featuredTVShows.length)]
    : null;
  
  const bannerImage = featuredContent 
    ? await prisma.imageAsset.findFirst({
        where: { 
          key: { contains: featuredContent.title.toLowerCase().replace(/\s+/g, '-') },
          type: 'BANNER'
        }
      })
    : null;
  
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
                <Link href="/browse/series" className="nav-link active">
                  TV Shows
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/movies" className="nav-link">
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
                <span className="hero-seasons">Multiple Seasons</span>
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
        
        
        <section className="genre-filter">
          <div className="filter-container">
            <h2 className="filter-title">TV Shows</h2>
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
        
        
        {trendingTVShows.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Trending TV Shows</h2>
            <div className="content-row">
              {trendingTVShows.map((item) => (
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
        
        {popularTVShows.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Popular TV Shows</h2>
            <div className="content-row">
              {popularTVShows.map((item) => (
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
        
        {dramaTVShows.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Drama TV Shows</h2>
            <div className="content-row">
              {dramaTVShows.map((item) => (
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
        
        {comedyTVShows.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Comedy TV Shows</h2>
            <div className="content-row">
              {comedyTVShows.map((item) => (
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
