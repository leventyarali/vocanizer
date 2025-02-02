// app/admin/content/videos/page.tsx
"use client";

import { VideoList } from "@/components/content/videos/VideoList";
import { VideoFilters } from "@/components/content/videos/VideoFilters";
import { useVideos } from "@/hooks/videos/useVideos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VideosPage() {
  const { videos, isLoading, error, applyFilters, filters } = useVideos();
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  const handleVideoSelect = (videoId: string, selected: boolean) => {
    setSelectedVideos(prev => 
      selected 
        ? [...prev, videoId]
        : prev.filter(id => id !== videoId)
    );
  };

  if (error) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center space-y-4">
        <p className="text-red-600">Hata: {error.message}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Yeniden Dene
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Videolar</h1>
        <div className="flex gap-2">
          {selectedVideos.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedVideos([])}
            >
              Seçimi Temizle ({selectedVideos.length})
            </Button>
          )}
          <Button
            asChild
            className="bg-primary text-white hover:bg-primary/90"
          >
            <a href="/admin/content/videos/new">
              Yeni Video Ekle
            </a>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <VideoFilters 
            onChange={applyFilters} 
            filters={filters}
            isLoading={isLoading}
          />
        </div>
        
        <VideoList 
          videos={videos} 
          onFilterChange={applyFilters}
          isLoading={isLoading}
          onVideoSelect={handleVideoSelect}
          selectedVideos={selectedVideos}
        />
      </div>
    </div>
  );
}