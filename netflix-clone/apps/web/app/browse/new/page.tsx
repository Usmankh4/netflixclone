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
  title: 'Netflix Clone - New & Popular',
  description: 'Browse new and popular content on Netflix Clone.',
};


export default async function NewAndPopular(): Promise<ReactElement> {
  // Server-side authentication check
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
  
  const now = new Date();
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const newReleases = await prisma.video.findMany({
    where: { 
      createdAt: {
        gte: thirtyDaysAgo
      }
    },
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  const trendingVideos = await prisma.video.findMany({
    where: { 
      trending: true 
    },
    take: 10,
  });
  
  const popularVideos = await prisma.video.findMany({
    take: 10,
    orderBy: {
      averageRating: 'desc'
    }
  });
  
  const featuredVideos = await prisma.video.findMany({
    where: { 
      featured: true 
    },
    take: 10,
  });
  
  const featuredContent = featuredVideos.length > 0 
    ? featuredVideos[Math.floor(Math.random() * featuredVideos.length)]
    : null;
  
  const bannerImage = featuredContent 
    ? await prisma.imageAsset.findFirst({
        where: { 
          key: { contains: featuredContent.title.toLowerCase().replace(/\s+/g, '-') },
          type: 'BANNER'
        }
      })
    : null;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
                <Link href="/browse/movies" className="nav-link">
                  Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/new" className="nav-link active">
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
                {featuredContent.type === 'SERIES' && <span className="hero-seasons">Multiple Seasons</span>}
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
        
        {/* Content Rows */}
        {newReleases.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">New Releases</h2>
            <div className="content-row">
              {newReleases.map((item) => (
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
                    <div className="content-release-date">
                      Released: {formatDate(item.createdAt)}
                    </div>
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
        
        {trendingVideos.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="content-row">
              {trendingVideos.map((item) => (
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
        
        {popularVideos.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Popular on Netflix</h2>
            <div className="content-row">
              {popularVideos.map((item) => (
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
