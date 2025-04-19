import { useState, useEffect } from 'react';
import { videosApi } from '../services/api';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  duration: number;
  genre: string[];
  releaseYear?: number;
  director?: string;
  cast: string[];
  maturityRating?: string;
  featured: boolean;
  trending: boolean;
  isOriginal: boolean;
  type: 'MOVIE' | 'SERIES';
  averageRating?: number;
  totalRatings: number;
}

interface VideosResponse {
  videos: Video[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseVideosOptions {
  type?: 'MOVIE' | 'SERIES';
  genre?: string;
  featured?: boolean;
  trending?: boolean;
  isOriginal?: boolean;
  limit?: number;
  page?: number;
  search?: string;
}

export function useVideos(options: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<VideosResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videosApi.getVideos(options);
        setVideos(response.videos);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [
    options.type,
    options.genre,
    options.featured,
    options.trending,
    options.isOriginal,
    options.limit,
    options.page,
    options.search,
  ]);

  return { videos, pagination, loading, error };
}

export function useFeaturedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        setLoading(true);
        const response = await videosApi.getFeaturedVideos();
        setVideos(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch featured videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideos();
  }, []);

  return { videos, loading, error };
}

export function useTrendingVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        setLoading(true);
        const response = await videosApi.getTrendingVideos();
        setVideos(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch trending videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  return { videos, loading, error };
}

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await videosApi.getVideo(id);
        setVideo(response);
        setError(null);
      } catch (err) {
        console.error(`Error fetching video with id ${id}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch video with id ${id}`));
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  return { video, loading, error };
}

export default useVideos;
