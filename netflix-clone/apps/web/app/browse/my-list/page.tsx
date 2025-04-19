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

const MyListCard = dynamic(
  () => import('../../components/MyListCard'),
  {
    ssr: false,
    loading: () => <div className="loading-card">Loading...</div>
  }
);

export const metadata: Metadata = {
  title: 'Netflix Clone - My List',
  description: 'View your saved content on Netflix Clone.',
};


export default async function MyList(): Promise<ReactElement> {

  const { userId } = auth();
  
  
  if (!userId) {
    redirect('/auth/signin');
  }
  
  const user = await getCurrentUser();
  
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId as string },
  });
  
 
  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId as string,
          email: user?.emailAddress || '',
          name: user?.firstName || 'Netflix User',
        },
      });
      
     
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
  
  let profile = await prisma.profile.findFirst({
    where: { userId: dbUser.id },
    include: {
      favorites: true,
    },
  });
  
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
  
  const myList = profile.favorites || [];
  
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
                <Link href="/browse/new" className="nav-link">
                  New & Popular
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/browse/my-list" className="nav-link active">
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
      
      <main className="browse-main my-list-main">
        <div className="my-list-header">
          <h1 className="my-list-title">My List</h1>
          <p className="my-list-description">
            A collection of movies and TV shows you've saved to watch later.
          </p>
        </div>
        
        {myList.length > 0 ? (
          <div className="my-list-grid">
            {myList.map((item) => (
              <MyListCard 
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnailUrl={item.thumbnailUrl}
                type={item.type}
                profileId={profile.id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <div className="empty-list-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="empty-list-title">Your list is empty</h2>
            <p className="empty-list-description">
              Add movies and TV shows to your list to watch them later.
            </p>
            <Link href="/browse" className="empty-list-button">
              Browse Content
            </Link>
          </div>
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
