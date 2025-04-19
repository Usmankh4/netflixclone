'use client';

import { useState } from 'react';
import { FC } from 'react';

interface AddToFavoritesButtonProps {
  profileId: string;
  videoId: string;
  isFavorited?: boolean;
}

const AddToFavoritesButton: FC<AddToFavoritesButtonProps> = ({
  profileId,
  videoId,
  isFavorited = false,
}: AddToFavoritesButtonProps) => {
  const [isInFavorites, setIsInFavorites] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const method = isInFavorites ? 'DELETE' : 'POST';
      const response = await fetch(`/api/profiles/${profileId}/favorites/${videoId}`, {
        method,
      });
      
      if (response.ok) {
        setIsInFavorites(!isInFavorites);
      } else {
        console.error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`content-add-button ${isInFavorites ? 'favorited' : ''}`}
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-label={isInFavorites ? "Remove from My List" : "Add to My List"}
    >
      {isInFavorites ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
};

export default AddToFavoritesButton;
