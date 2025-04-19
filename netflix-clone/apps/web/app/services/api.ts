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


  getVideo: async (id: string) => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },

  getFeaturedVideos: async () => {
    const response = await apiClient.get('/videos/featured/list');
    return response.data;
  },

  
  getTrendingVideos: async () => {
    const response = await apiClient.get('/videos/trending/list');
    return response.data;
  },
};

export const profilesApi = {
  getProfiles: async (userId: string) => {
    const response = await apiClient.get('/profiles', { params: { userId } });
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  createProfile: async (data: { name: string; imageUrl?: string; userId: string }) => {
    const response = await apiClient.post('/profiles', data);
    return response.data;
  },

  updateProfile: async (id: string, data: { name?: string; imageUrl?: string }) => {
    const response = await apiClient.put(`/profiles/${id}`, data);
    return response.data;
  },

  
  deleteProfile: async (id: string) => {
    const response = await apiClient.delete(`/profiles/${id}`);
    return response.data;
  },

  addToFavorites: async (profileId: string, videoId: string) => {
    const response = await apiClient.post(`/profiles/${profileId}/favorites/${videoId}`);
    return response.data;
  },

  
  removeFromFavorites: async (profileId: string, videoId: string) => {
    const response = await apiClient.delete(`/profiles/${profileId}/favorites/${videoId}`);
    return response.data;
  },

  
  getWatchHistory: async (profileId: string, params?: { limit?: number; page?: number }) => {
    const response = await apiClient.get(`/profiles/${profileId}/watch-history`, { params });
    return response.data;
  },

  updateWatchHistory: async (
    profileId: string,
    data: { videoId: string; progress?: number; completed?: boolean }
  ) => {
    const response = await apiClient.post(`/profiles/${profileId}/watch-history`, data);
    return response.data;
  },
};


export const ratingsApi = {
 
  getRatings: async (params?: { videoId?: string; userId?: string; limit?: number; page?: number }) => {
    const response = await apiClient.get('/ratings', { params });
    return response.data;
  },

 
  getRating: async (id: string) => {
    const response = await apiClient.get(`/ratings/${id}`);
    return response.data;
  },

  createOrUpdateRating: async (data: {
    userId: string;
    videoId: string;
    value: number;
    comment?: string;
  }) => {
    const response = await apiClient.post('/ratings', data);
    return response.data;
  },

  
  deleteRating: async (id: string) => {
    const response = await apiClient.delete(`/ratings/${id}`);
    return response.data;
  },
};


export const subscriptionsApi = {
 
  getPlans: async () => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

 
  getUserSubscription: async (userId: string) => {
    const response = await apiClient.get(`/subscriptions/user/${userId}`);
    return response.data;
  },

  
  createCheckoutSession: async (data: {
    userId: string;
    planType: 'BASIC' | 'STANDARD' | 'PREMIUM';
    successUrl: string;
    cancelUrl: string;
  }) => {
    const response = await apiClient.post('/subscriptions/create-checkout-session', data);
    return response.data;
  },

  
  cancelSubscription: async (userId: string) => {
    const response = await apiClient.post('/subscriptions/cancel', { userId });
    return response.data;
  },
};


export default {
  videos: videosApi,
  profiles: profilesApi,
  ratings: ratingsApi,
  subscriptions: subscriptionsApi,
};
