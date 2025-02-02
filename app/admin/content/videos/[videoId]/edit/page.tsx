// app/admin/content/videos/[videoId]/edit/page.tsx
"use client";

import React from "react";
import { useVideo } from "@/hooks/videos/useVideo";
import { VideoForm } from "@/components/content/videos/VideoForm";
import { VideoPlayer } from "@/components/content/videos/VideoPlayer";
import { VideoMetadata } from "@/components/content/videos/VideoMetadata";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoDetailPageProps {
  params: {
    videoId: string;
  };
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { videoId } = params;
  const { video, isLoading, error } = useVideo(videoId);
  const { toast } = useToast();
  const {
    handleSubmit,
    formState: { isSubmitting },
    onSuccess
  } = useVideoForm({
    videoId,
    onSaved: () => {
      toast({
        title: "Başarılı",
        description: "Video başarıyla güncellendi",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Video yüklenirken bir hata oluştu: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!video) {
    return (
      <Alert>
        <AlertDescription>
          Video bulunamadı
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Video Düzenle</h1>
          <VideoPlayer url={video.url} />
          <VideoMetadata
            metadata={video.metadata}
            onUpdate={async (metadata) => {
              try {
                const response = await fetch(`/api/videos/${video.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ metadata }),
                });
                
                if (!response.ok) throw new Error('Meta bilgiler güncellenirken bir hata oluştu');
                
                toast({
                  title: "Başarılı",
                  description: "Meta bilgiler güncellendi",
                });
              } catch (error) {
                toast({
                  title: "Hata",
                  description: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
                  variant: "destructive",
                });
              }
            }}
          />
        </div>
       
        <div>
          <VideoForm
            video={video}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}
