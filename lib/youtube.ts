// lib/youtube.ts
import { google } from 'googleapis';
import { YouTubeVideo, YouTubeSearchParams, YouTubeSearchResponse } from './types/youtube';

const youtube = google.youtube('v3');

export async function searchVideos({
  query,
  channelId,
  publishedAfter,
  publishedBefore,
  maxResults = 100,
  pageToken,
  minViewCount,
  videoDuration,
  hasCaption,
  videoDefinition,
}: YouTubeSearchParams): Promise<YouTubeSearchResponse> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  });

  const searchParams: any = {
    auth,
    part: ['snippet'],
    type: ['video'],
    q: query,
    maxResults: Math.min(maxResults, 100),
    order: 'date',
  };

  if (channelId) searchParams.channelId = channelId;
  if (publishedAfter) searchParams.publishedAfter = publishedAfter;
  if (publishedBefore) searchParams.publishedBefore = publishedBefore;
  if (pageToken) searchParams.pageToken = pageToken;
  if (hasCaption) searchParams.videoCaption = 'closedCaption';
  if (videoDuration) searchParams.videoDuration = videoDuration;
  if (videoDefinition) searchParams.videoDefinition = videoDefinition;

  const searchResponse = await youtube.search.list(searchParams);
  
  if (!searchResponse.data.items?.length) {
    return {
      videos: [],
      nextPageToken: undefined,
      totalResults: 0,
    };
  }

  const videoIds = searchResponse.data.items.map(item => item.id?.videoId).filter(Boolean);
  const videosResponse = await youtube.videos.list({
    auth,
    part: ['snippet', 'contentDetails', 'statistics'],
    id: videoIds as string[],
  });

  let videos = videosResponse.data.items?.map(video => ({
    id: video.id!,
    title: video.snippet?.title ?? '',
    description: video.snippet?.description ?? '',
    thumbnails: {
      default: video.snippet?.thumbnails?.default ? {
        url: video.snippet.thumbnails.default.url ?? '',
      } : undefined,
      medium: video.snippet?.thumbnails?.medium ? {
        url: video.snippet.thumbnails.medium.url ?? '',
      } : undefined,
      high: video.snippet?.thumbnails?.high ? {
        url: video.snippet.thumbnails.high.url ?? '',
      } : undefined,
    },
    duration: video.contentDetails?.duration ?? '',
    publishedAt: video.snippet?.publishedAt ?? '',
    viewCount: video.statistics?.viewCount ?? undefined,
    channelTitle: video.snippet?.channelTitle ?? undefined,
    tags: video.snippet?.tags ?? undefined,
    language: video.snippet?.defaultLanguage ?? undefined,
  })) || [];

  if (minViewCount) {
    videos = videos.filter(video => 
      parseInt(video.viewCount || '0') >= minViewCount
    );
  }

  return {
    videos,
    nextPageToken: searchResponse.data.nextPageToken,
    totalResults: searchResponse.data.pageInfo?.totalResults || 0,
  };
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideo> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  });

  const response = await youtube.videos.list({
    auth,
    part: ['snippet', 'contentDetails', 'statistics'],
    id: [videoId],
  });

  const video = response.data.items?.[0];
  if (!video) throw new Error('Video bulunamadı');

  return {
    id: video.id!,
    title: video.snippet?.title ?? '',
    description: video.snippet?.description ?? '',
    thumbnails: {
      default: video.snippet?.thumbnails?.default ? {
        url: video.snippet.thumbnails.default.url ?? '',
      } : undefined,
      medium: video.snippet?.thumbnails?.medium ? {
        url: video.snippet.thumbnails.medium.url ?? '',
      } : undefined,
      high: video.snippet?.thumbnails?.high ? {
        url: video.snippet.thumbnails.high.url ?? '',
      } : undefined,
    },
    duration: video.contentDetails?.duration ?? '',
    publishedAt: video.snippet?.publishedAt ?? '',
    viewCount: video.statistics?.viewCount ?? undefined,
    channelTitle: video.snippet?.channelTitle ?? undefined,
    tags: video.snippet?.tags ?? undefined,
    language: video.snippet?.defaultLanguage ?? undefined,
  };
}
