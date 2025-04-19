"use client";

import { FC, useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const UserButton: FC = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      return firstName.charAt(0);
    } else {
      return '?';
    }
  };

  return (
    <div className="netflix-user-button-container">
      <button 
        onClick={toggleDropdown} 
        className="netflix-user-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="netflix-user-avatar">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt="User avatar" 
              className="netflix-user-avatar-image" 
            />
          ) : (
            <div className="netflix-user-avatar-placeholder">
              {getUserInitials()}
            </div>
          )}
        </div>
        <span className="netflix-user-button-caret">▼</span>
      </button>
      
      {isOpen && (
        <div className="netflix-user-dropdown">
          <div className="netflix-user-dropdown-header">
            <div className="netflix-user-info">
              <p className="netflix-user-email">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <ul className="netflix-user-dropdown-menu">
            <li>
              <Link href="/profile" className="netflix-user-dropdown-item" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/account" className="netflix-user-dropdown-item" onClick={() => setIsOpen(false)}>
                Account
              </Link>
            </li>
            <li>
              <button 
                className="netflix-user-dropdown-item netflix-user-signout-button" 
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserButton;
