"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VideoSearch } from '@/components/content/videos/VideoSearch';
import { VideoForm } from '@/components/content/videos/VideoForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function CreateVideoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [step, setStep] = useState<'search' | 'form'>('search');

  const handleVideoSelect = (video: any) => {
    setSelectedVideo({
      title: video.title,
      description: video.description,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnailUrl: video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url,
      metadata: {
        youtubeId: video.id,
        viewCount: parseInt(video.viewCount || '0'),
        tags: video.tags || [],
      },
    });
    setStep('form');
  };

  const handleBack = () => {
    setStep('search');
    setSelectedVideo(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...selectedVideo,
          media_type: 'youtube',
          status: 'draft',
        }),
      });

      if (!response.ok) throw new Error('Video eklenirken bir hata oluştu');

      toast({
        title: 'Başarılı',
        description: 'Video başarıyla eklendi',
      });

      router.push('/admin/content/videos');
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Video Ekle</h1>
      </div>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {step === 'search' ? 'Video Ara' : 'Video Detayları'}
          </h1>
          {step === 'form' && (
            <Button variant="outline" onClick={handleBack}>
              Aramaya Dön
            </Button>
          )}
        </div>

        {step === 'search' ? (
          <VideoSearch onVideoSelect={handleVideoSelect} />
        ) : (
          <VideoForm
            video={selectedVideo}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}