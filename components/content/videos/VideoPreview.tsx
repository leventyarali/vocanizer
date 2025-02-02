"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Plus, ThumbsUp, Eye, Calendar, Clock, Subtitles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoPreviewProps {
  video: any;
  onSelect: (video: any) => void;
  onClose?: () => void;
}

export function VideoPreview({ video, onSelect, onClose }: VideoPreviewProps) {
  const [transcript, setTranscript] = useState<string>('');
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelect = () => {
    onSelect(video);
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const fetchTranscript = async () => {
    try {
      setIsLoadingTranscript(true);
      const response = await fetch(`/api/videos/youtube/transcript?videoId=${video.id}`);
      const data = await response.json();
      setTranscript(data.transcript || 'Transkript bulunamadı');
    } catch (error) {
      setTranscript('Transkript yüklenirken bir hata oluştu');
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  if (!isClient) return null;

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="h-full overflow-y-auto space-y-4">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Önizleme</TabsTrigger>
              <TabsTrigger value="transcript" onClick={fetchTranscript}>Transkript</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Yayın Tarihi: {format(new Date(video.publishedAt), 'dd MMM yyyy HH:mm', { locale: tr })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{parseInt(video.viewCount).toLocaleString()} görüntüleme</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Kanal: {video.channelTitle}</span>
                  </div>
                  {video.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Süre: {video.duration}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Açıklama</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{video.description}</p>
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {video.tags.map((tag: string) => (
                        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="min-h-[400px]">
              {isLoadingTranscript ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-muted-foreground">Transkript yükleniyor...</span>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{transcript}</pre>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 sticky bottom-0 bg-background p-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Kapat
            </Button>
            <Button onClick={handleSelect}>
              <Plus className="w-4 h-4 mr-2" />
              Video Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 