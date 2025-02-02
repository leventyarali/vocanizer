"use client";

// hooks/videos/useVideo.ts
import { useState, useEffect } from "react";
import type { Video } from "@/lib/types/video";

export function useVideo(videoId: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/videos/${videoId}`);
        if (!response.ok) throw new Error("Video yüklenirken bir hata oluştu");
        
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu"));
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  return {
    video,
    isLoading,
    error,
  };
}
