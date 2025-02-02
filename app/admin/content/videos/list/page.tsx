"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoList } from "@/components/content/videos/VideoList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { VideoFilters } from "@/components/content/videos/VideoFilters";
import { useVideos } from "@/hooks/videos/useVideos";

export default function VideoListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<VideoFilters>({});
  const { videos, isLoading } = useVideos(filters);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tüm Videolar</h1>
        <Button onClick={() => router.push("/admin/content/videos/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Video Ekle
        </Button>
      </div>

      <VideoList 
        videos={videos} 
        onFilterChange={(newFilters) => {
          setFilters(prev => ({ ...prev, ...newFilters }));
        }} 
      />
    </div>
  );
}