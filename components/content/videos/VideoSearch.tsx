"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, subDays, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Loader2, Search, Calendar, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { VideoPreview } from "./VideoPreview";
import { VideoFilters } from "./VideoFilters";
import { YouTubeVideo } from "../../../lib/types/youtube";

interface VideoSearchProps {
  onVideoSelect: (video: YouTubeVideo) => void;
}

export function VideoSearch({ onVideoSelect }: VideoSearchProps) {
  const [query, setQuery] = useState('');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore, setPublishedBefore] = useState('');
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    channelTitle?: string;
    minViewCount?: string;
    duration?: 'short' | 'medium' | 'long';
    hasCaption?: boolean;
    isHD?: boolean;
  }>({});
  const [mounted, setMounted] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useRef<HTMLDivElement | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDateFilter = (period: 'today' | 'week' | 'month') => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = today;
        endDate = endOfDay(today);
        break;
      case 'week':
        startDate = startOfWeek(today, { locale: tr });
        endDate = endOfWeek(today, { locale: tr });
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
    }

    setPublishedAfter(startDate.toISOString().split('T')[0]);
    setPublishedBefore(endDate.toISOString().split('T')[0]);
    updateActiveFilters('date', period);
  };

  const updateActiveFilters = (type: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = prev.filter(f => !f.startsWith(type + ':'));
      return [...newFilters, `${type}:${value}`];
    });
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
    const [type] = filter.split(':');
    if (type === 'date') {
      setPublishedAfter('');
      setPublishedBefore('');
    } else if (type === 'channel') {
      setChannelId('');
    }
  };

  const handleSearch = async (newSearch = true) => {
    try {
      if (!query) {
        setError('Lütfen bir arama terimi girin');
        return;
      }

      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        query,
        ...(publishedAfter && { publishedAfter: new Date(publishedAfter).toISOString() }),
        ...(publishedBefore && { publishedBefore: new Date(publishedBefore).toISOString() }),
        ...(channelId && { channelId }),
        ...(pageToken && !newSearch && { pageToken }),
        ...(filters.minViewCount && { minViewCount: filters.minViewCount.toString() }),
        ...(filters.duration && { videoDuration: filters.duration }),
        ...(filters.hasCaption && { hasCaption: 'true' }),
        ...(filters.isHD && { videoDefinition: 'high' }),
        maxResults: '12',
      });

      console.log('Search params:', params.toString());

      const response = await fetch(`/api/videos/youtube?${params.toString()}`);
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Arama sırasında bir hata oluştu');
        } else {
          throw new Error('API yanıt vermedi');
        }
      }

      if (!contentType?.includes('application/json')) {
        throw new Error('API geçersiz yanıt döndü');
      }

      const data = await response.json();
      console.log('Search results:', data);
      
      if (!data.videos || !Array.isArray(data.videos)) {
        throw new Error('API geçersiz veri formatı döndü');
      }
      
      let filteredVideos = data.videos;
      
      // Kanal adı filtresi
      if (filters.channelTitle?.trim()) {
        filteredVideos = filteredVideos.filter((video: YouTubeVideo) => 
          video.channelTitle.toLowerCase().includes(filters.channelTitle!.toLowerCase())
        );
      }

      if (newSearch) {
        setVideos(filteredVideos);
        setTotalResults(Math.min(data.totalResults || 0, 1000));
      } else {
        setVideos(prev => [...prev, ...filteredVideos]);
      }
      
      setPageToken(data.nextPageToken);
      setHasMore(!!data.nextPageToken);

      if (data.videos.length === 0) {
        setError('Sonuç bulunamadı');
      }

      if (publishedAfter || publishedBefore) {
        const filteredVideos = data.videos.filter((video: YouTubeVideo) => {
          const publishDate = new Date(video.publishedAt);
          const afterDate = publishedAfter ? new Date(publishedAfter) : null;
          const beforeDate = publishedBefore ? new Date(publishedBefore) : null;
          
          return (!afterDate || publishDate >= afterDate) && 
                 (!beforeDate || publishDate <= beforeDate);
        });
        
        if (newSearch) {
          setVideos(filteredVideos);
          setTotalResults(filteredVideos.length);
        } else {
          setVideos(prev => [...prev, ...filteredVideos]);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      setVideos([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        handleSearch(false);
      }
    }, options);

    if (lastVideoRef.current) {
      observer.current.observe(lastVideoRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, query, publishedAfter, publishedBefore, channelId]);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Card key={`skeleton-${n}`} className="overflow-hidden">
              <Skeleton className="aspect-video" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-sm border">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Video ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(true)}
              />
            </div>
            
            <Button 
              onClick={() => handleSearch(true)} 
              disabled={!query || loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Ara'
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex-1">
              <Select onValueChange={(value) => handleDateFilter(value as 'today' | 'week' | 'month')}>
                <SelectTrigger>
                  <SelectValue placeholder="Tarih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Bugün</SelectItem>
                  <SelectItem value="week">Bu Hafta</SelectItem>
                  <SelectItem value="month">Bu Ay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Input
                placeholder="Kanal adı ile ara..."
                value={filters.channelTitle || ''}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    channelTitle: e.target.value
                  }));
                  handleSearch(true);
                }}
              />
            </div>

            <div className="flex-1">
              <Select 
                onValueChange={(value) => {
                  setFilters(prev => ({
                    ...prev,
                    minViewCount: value
                  }));
                  handleSearch(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İzlenme Sayısı" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0-500</SelectItem>
                  <SelectItem value="501">501-1000</SelectItem>
                  <SelectItem value="1001">1001-5000</SelectItem>
                  <SelectItem value="5001">5001-10000</SelectItem>
                  <SelectItem value="10001">10001+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select 
                onValueChange={(value: 'short' | 'medium' | 'long') => {
                  setFilters(prev => ({
                    ...prev,
                    duration: value
                  }));
                  handleSearch(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Video Süresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Kısa (&lt; 4 dk)</SelectItem>
                  <SelectItem value="medium">Orta (4-20 dk)</SelectItem>
                  <SelectItem value="long">Uzun (&gt; 20 dk)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasCaption || false}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      hasCaption: e.target.checked
                    }));
                    handleSearch(true);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Alt Yazı</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isHD || false}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      isHD: e.target.checked
                    }));
                    handleSearch(true);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">HD</span>
              </label>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Aktif Filtreler:</span>
              {activeFilters.map((filter) => {
                const [type, value] = filter.split(':');
                let label = value;
                if (type === 'date') {
                  switch (value) {
                    case 'today':
                      label = 'Bugün';
                      break;
                    case 'week':
                      label = 'Bu Hafta';
                      break;
                    case 'month':
                      label = 'Bu Ay';
                      break;
                  }
                }
                return (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => removeFilter(filter)}
                  >
                    {type === 'channel' ? 'Kanal:' : 'Tarih:'} {label}
                    <span className="ml-1">×</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-center">
          {error}
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="text-muted-foreground mb-4">
          Toplam {totalResults.toLocaleString()} sonuç bulundu
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <Card
            key={video.id}
            ref={index === videos.length - 1 ? lastVideoRef : null}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div 
              className="relative aspect-video"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVideo(video);
              }}
            >
              <img
                src={video.thumbnails.medium?.url || video.thumbnails.default?.url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm">
                  İncele
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{format(new Date(video.publishedAt), 'dd MMM yyyy', { locale: tr })}</span>
                <span>{video.viewCount ? `${parseInt(video.viewCount).toLocaleString()} görüntüleme` : ''}</span>
              </div>
            </div>
            {selectedVideo?.id === video.id && (
              <VideoPreview 
                video={video} 
                onSelect={onVideoSelect}
                onClose={() => setSelectedVideo(null)}
              />
            )}
          </Card>
        ))}

        {loading && (
          <>
            {[1, 2, 3].map((n) => (
              <Card key={`skeleton-${n}`} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {!loading && !hasMore && videos.length > 0 && (
        <div className="text-center text-muted-foreground">
          Başka video bulunamadı
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="text-center text-muted-foreground py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Video aramak için yukarıdaki arama kutusunu kullanın</p>
        </div>
      )}
    </div>
  );
} 