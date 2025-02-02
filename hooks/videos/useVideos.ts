// hooks/videos/useVideos.ts
import { useState, useEffect, useCallback } from "react";
import type { Video } from "@/lib/types/video";
import { useDebounce } from "../useDebounce";

export interface VideoFilters {
  search?: string;
  channelTitle?: string;
  publishedAfter?: string;
  minViewCount?: number;
  duration?: string;
  hasCaption?: boolean;
  isHD?: boolean;
  language?: string;
  cefrLevel?: string;
  status?: 'draft' | 'published' | 'archived';
}

interface VideoResponse {
  items: Video[];
  totalResults: number;
  nextPageToken?: string;
}

export function useVideos(initialFilters: VideoFilters = {}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<VideoFilters>(initialFilters);
  const [totalResults, setTotalResults] = useState<number>(0);
  
  const debouncedFilters = useDebounce(filters, 500);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/videos?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(
          response.status === 429 
            ? "API sorgu limiti aşıldı. Lütfen daha sonra tekrar deneyin."
            : "Videolar yüklenirken bir hata oluştu"
        );
      }
      
      const data: VideoResponse = await response.json();
      setVideos(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu"));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters]);

  const applyFilters = useCallback((newFilters: Partial<VideoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    isLoading,
    error,
    applyFilters,
    filters,
    totalResults,
  };
}
