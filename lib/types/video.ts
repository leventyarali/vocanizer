// lib/types/video.ts
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  language_id: string;
  cefr_level: string;
  media_type: 'youtube';
  status: 'draft' | 'published' | 'archived';
  metadata: {
    youtubeId: string;
    viewCount?: number;
    tags?: string[];
    notes?: string;
  };
  created_at: string;
  updated_at: string;
}