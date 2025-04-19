"use client";

import { FC, useState } from 'react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | undefined;
  imageUrl: string;
}

interface ClientSideButtonProps {
  user: User;
}

/**
 * ClientSideButton Component
 * 
 * This is a client component that handles interactive user actions
 * like signing out. It's separated from server components to maintain
 * the benefits of SSR while still allowing interactivity.
 * 
 * Now uses a click-based dropdown instead of hover for better usability.
 */
const ClientSideButton: FC<ClientSideButtonProps> = ({ user }) => {
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the first letter of the email address for the avatar placeholder
  // Use optional chaining and nullish coalescing to safely access properties
  const firstLetter = user.firstName?.[0] ?? '';
  const emailFirstLetter = user.emailAddress && user.emailAddress.length > 0 
    ? user.emailAddress.charAt(0).toUpperCase() 
    : '';
  const avatarLetter = firstLetter || emailFirstLetter || '?';
  
  // Check if user has an image URL
  const hasImage = Boolean(user.imageUrl);
  
  const handleSignOut = async () => {
    await signOut();
    // Clerk will automatically redirect to the homepage
  };
  
  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking on an option
  const closeDropdown = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="netflix-user-button-container">
      <button 
        onClick={toggleDropdown} 
        className="netflix-user-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Display user's profile image or a default avatar */}
        <div className="netflix-user-avatar">
          {hasImage ? (
            <img 
              src={user.imageUrl}
              alt={user.firstName || 'User'} 
              className="netflix-user-avatar-image" 
            />
          ) : (
            <div className="netflix-user-avatar-placeholder">
              {avatarLetter}
            </div>
          )}
        </div>
        <span className="netflix-user-button-caret">▼</span>
      </button>
      
      {/* Dropdown menu - only shown when isOpen is true */}
      {isOpen && (
        <div className="netflix-user-dropdown">
          <div className="netflix-user-dropdown-header">
            <div className="netflix-user-info">
              <p className="netflix-user-email">{user.emailAddress || ''}</p>
            </div>
          </div>
          <ul className="netflix-user-dropdown-menu">
            <li>
              <Link 
                href="/profile" 
                className="netflix-user-dropdown-item"
                onClick={closeDropdown}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link 
                href="/account" 
                className="netflix-user-dropdown-item"
                onClick={closeDropdown}
              >
                Account
              </Link>
            </li>
            <li>
              <button 
                onClick={handleSignOut} 
                className="netflix-user-dropdown-item netflix-user-signout-button"
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

export default ClientSideButton;
