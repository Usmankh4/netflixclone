import axios from 'axios';

// Base URL for the API - using Next.js API routes
const API_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Videos API
export const videosApi = {
  // Get all videos with optional filtering
  getVideos: async (params?: {
    type?: string;
    genre?: string;
    featured?: boolean;
    trending?: boolean;
    isOriginal?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  }) => {
    const response = await apiClient.get('/videos', { params });
    return response.data;
  },

  // Get a single video by ID
  getVideo: async (id: string) => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },

  // Get featured videos
  getFeaturedVideos: async () => {
    const response = await apiClient.get('/videos/featured/list');
    return response.data;
  },

  // Get trending videos
  getTrendingVideos: async () => {
    const response = await apiClient.get('/videos/trending/list');
    return response.data;
  },
};

// Profiles API
export const profilesApi = {
  // Get all profiles for a user
  getProfiles: async (userId: string) => {
    const response = await apiClient.get('/profiles', { params: { userId } });
    return response.data;
  },

  // Get a single profile by ID
  getProfile: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  // Create a new profile
  createProfile: async (data: { name: string; imageUrl?: string; userId: string }) => {
    const response = await apiClient.post('/profiles', data);
    return response.data;
  },

  // Update a profile
  updateProfile: async (id: string, data: { name?: string; imageUrl?: string }) => {
    const response = await apiClient.put(`/profiles/${id}`, data);
    return response.data;
  },

  // Delete a profile
  deleteProfile: async (id: string) => {
    const response = await apiClient.delete(`/profiles/${id}`);
    return response.data;
  },

  // Add a video to profile favorites
  addToFavorites: async (profileId: string, videoId: string) => {
    const response = await apiClient.post(`/profiles/${profileId}/favorites/${videoId}`);
    return response.data;
  },

  // Remove a video from profile favorites
  removeFromFavorites: async (profileId: string, videoId: string) => {
    const response = await apiClient.delete(`/profiles/${profileId}/favorites/${videoId}`);
    return response.data;
  },

  // Get watch history for a profile
  getWatchHistory: async (profileId: string, params?: { limit?: number; page?: number }) => {
    const response = await apiClient.get(`/profiles/${profileId}/watch-history`, { params });
    return response.data;
  },

  // Add or update watch history entry
  updateWatchHistory: async (
    profileId: string,
    data: { videoId: string; progress?: number; completed?: boolean }
  ) => {
    const response = await apiClient.post(`/profiles/${profileId}/watch-history`, data);
    return response.data;
  },
};

// Ratings API
export const ratingsApi = {
  // Get all ratings with optional filtering
  getRatings: async (params?: { videoId?: string; userId?: string; limit?: number; page?: number }) => {
    const response = await apiClient.get('/ratings', { params });
    return response.data;
  },

  // Get a single rating by ID
  getRating: async (id: string) => {
    const response = await apiClient.get(`/ratings/${id}`);
    return response.data;
  },

  // Create a new rating or update if exists
  createOrUpdateRating: async (data: {
    userId: string;
    videoId: string;
    value: number;
    comment?: string;
  }) => {
    const response = await apiClient.post('/ratings', data);
    return response.data;
  },

  // Delete a rating
  deleteRating: async (id: string) => {
    const response = await apiClient.delete(`/ratings/${id}`);
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsApi = {
  // Get all subscription plans
  getPlans: async () => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  // Get subscription for a user
  getUserSubscription: async (userId: string) => {
    const response = await apiClient.get(`/subscriptions/user/${userId}`);
    return response.data;
  },

  // Create a checkout session for subscription
  createCheckoutSession: async (data: {
    userId: string;
    planType: 'BASIC' | 'STANDARD' | 'PREMIUM';
    successUrl: string;
    cancelUrl: string;
  }) => {
    const response = await apiClient.post('/subscriptions/create-checkout-session', data);
    return response.data;
  },

  // Cancel a subscription
  cancelSubscription: async (userId: string) => {
    const response = await apiClient.post('/subscriptions/cancel', { userId });
    return response.data;
  },
};

// Export all APIs
export default {
  videos: videosApi,
  profiles: profilesApi,
  ratings: ratingsApi,
  subscriptions: subscriptionsApi,
};
