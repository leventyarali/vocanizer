import React, { useState } from "react";
import { VideoCard } from "./VideoCard";
import { VideoFilters } from "./VideoFilters";
import type { Video } from "@/lib/types/video";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface VideoListProps {
  videos: Video[];
  onFilterChange: (filters: any) => void;
  isLoading?: boolean;
  onVideoSelect?: (videoId: string, selected: boolean) => void;
  selectedVideos?: string[];
}

export function VideoList({ 
  videos, 
  isLoading, 
  onVideoSelect,
  selectedVideos = []
}: VideoListProps) {
  if (isLoading) {
    return <VideoListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Toplam {videos.length} video
        </span>
      </div>

      {videos.map((video) => (
        <div 
          key={video.id}
          className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          {onVideoSelect && (
            <div className="flex items-center">
              <Checkbox
                checked={selectedVideos.includes(video.id)}
                onCheckedChange={(checked) => 
                  onVideoSelect(video.id, checked as boolean)
                }
              />
            </div>
          )}

          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-48 h-27 object-cover rounded"
          />
          
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <span className="text-sm text-gray-500">
                {formatDistance(new Date(video.created_at), new Date(), { 
                  addSuffix: true,
                  locale: tr 
                })}
              </span>
            </div>
            
            <p className="text-gray-600 mt-2 line-clamp-2">{video.description}</p>
            
            <div className="flex gap-2 mt-4">
              <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                {video.cefr_level}
              </span>
              {video.metadata.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs rounded bg-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4 mt-4">
              <a
                href={`/admin/content/videos/${video.id}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Görüntüle
              </a>
              <a
                href={`/admin/content/videos/${video.id}/edit`}
                className="text-sm text-primary hover:underline"
              >
                Düzenle
              </a>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => {
                  if (confirm("Bu videoyu silmek istediğinize emin misiniz?")) {
                    // TODO: Delete video
                  }
                }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow">
          <Skeleton className="w-48 h-27 rounded" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}