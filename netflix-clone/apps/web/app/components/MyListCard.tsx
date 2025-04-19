'use client';

import { FC } from 'react';
import Image from 'next/image';

interface MyListCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  type: string;
  profileId: string;
}

const MyListCard: FC<MyListCardProps> = ({
  id,
  title,
  thumbnailUrl,
  type,
  profileId
}) => {
  const handleRemoveFromFavorites = async () => {
    try {
      await fetch(`/api/profiles/${profileId}/favorites/${id}`, {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="content-card my-list-card">
      <img 
        src={thumbnailUrl} 
        alt={title} 
        className="content-image"
        width={300}
        height={450}
      />
      <div className="content-overlay">
        <h3 className="content-title">{title}</h3>
        <div className="content-type">{type === 'SERIES' ? 'TV Series' : 'Movie'}</div>
        <div className="content-actions">
          <button className="content-play-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
            </svg>
          </button>
          <button 
            className="content-remove-button"
            onClick={handleRemoveFromFavorites}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyListCard;
