import { useState, useEffect } from 'react';
import { profilesApi } from '../services/api';

export interface Profile {
  id: string;
  name: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  favorites?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    type: string;
    averageRating?: number;
  }[];
}

export interface WatchHistoryItem {
  id: string;
  profileId: string;
  videoId: string;
  watchedAt: string;
  progress: number;
  completed: boolean;
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    type: string;
  };
}

export interface WatchHistoryResponse {
  watchHistory: WatchHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Hook to get all profiles for a user
export function useProfiles(userId: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await profilesApi.getProfiles(userId);
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profiles'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userId]);

  return { profiles, loading, error };
}

// Hook to get a single profile by ID
export function useProfile(profileId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      
      try {
        setLoading(true);
        const data = await profilesApi.getProfile(profileId);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching profile with id ${profileId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch profile with id ${profileId}`));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  return { profile, loading, error };
}

// Hook to get watch history for a profile
export function useWatchHistory(profileId: string, options: { limit?: number; page?: number } = {}) {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [pagination, setPagination] = useState<WatchHistoryResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!profileId) return;
      
      try {
        setLoading(true);
        const response = await profilesApi.getWatchHistory(profileId, options);
        setWatchHistory(response.watchHistory);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        console.error(`Error fetching watch history for profile ${profileId}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch watch history for profile ${profileId}`));
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [profileId, options.limit, options.page]);

  return { watchHistory, pagination, loading, error };
}

// Functions for managing profiles
export function useProfileActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new profile
  const createProfile = async (data: { name: string; imageUrl?: string; userId: string }) => {
    try {
      setLoading(true);
      const response = await profilesApi.createProfile(data);
      setError(null);
      return response;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to create profile'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a profile
  const updateProfile = async (id: string, data: { name?: string; imageUrl?: string }) => {
    try {
      setLoading(true);
      const response = await profilesApi.updateProfile(id, data);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error updating profile ${id}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to update profile ${id}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a profile
  const deleteProfile = async (id: string) => {
    try {
      setLoading(true);
      const response = await profilesApi.deleteProfile(id);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error deleting profile ${id}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to delete profile ${id}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a video to favorites
  const addToFavorites = async (profileId: string, videoId: string) => {
    try {
      setLoading(true);
      const response = await profilesApi.addToFavorites(profileId, videoId);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error adding video ${videoId} to favorites for profile ${profileId}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to add video to favorites`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove a video from favorites
  const removeFromFavorites = async (profileId: string, videoId: string) => {
    try {
      setLoading(true);
      const response = await profilesApi.removeFromFavorites(profileId, videoId);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error removing video ${videoId} from favorites for profile ${profileId}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to remove video from favorites`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update watch history
  const updateWatchHistory = async (
    profileId: string,
    data: { videoId: string; progress?: number; completed?: boolean }
  ) => {
    try {
      setLoading(true);
      const response = await profilesApi.updateWatchHistory(profileId, data);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error updating watch history for profile ${profileId}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to update watch history`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProfile,
    updateProfile,
    deleteProfile,
    addToFavorites,
    removeFromFavorites,
    updateWatchHistory,
    loading,
    error,
  };
}

export default useProfiles;
