export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  duration?: string;
  viewCount?: string;
  tags?: string[];
  language?: string;
}

export interface YouTubeSearchParams {
  query: string;
  channelId?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  maxResults?: number;
  pageToken?: string;
  minViewCount?: number;
  videoDuration?: 'short' | 'medium' | 'long';
  hasCaption?: boolean;
  videoDefinition?: 'high' | 'standard';
}

export interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
} 