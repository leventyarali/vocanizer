import { NextResponse } from 'next/server';
import { getVideoDetails, searchVideos } from '@/lib/youtube';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const videoId = searchParams.get('videoId');
    const channelId = searchParams.get('channelId');
    const publishedAfter = searchParams.get('publishedAfter');
    const publishedBefore = searchParams.get('publishedBefore');
    const pageToken = searchParams.get('pageToken');
    const maxResults = searchParams.get('maxResults');
    const minViewCount = searchParams.get('minViewCount');
    const videoDuration = searchParams.get('videoDuration');
    const hasCaption = searchParams.get('hasCaption');
    const videoDefinition = searchParams.get('videoDefinition');

    if (videoId) {
      const videoDetails = await getVideoDetails(videoId);
      return NextResponse.json(videoDetails);
    } 
    
    if (query) {
      const searchResults = await searchVideos({
        query,
        channelId: channelId || undefined,
        publishedAfter: publishedAfter || undefined,
        publishedBefore: publishedBefore || undefined,
        maxResults: maxResults ? parseInt(maxResults) : undefined,
        pageToken: pageToken || undefined,
        minViewCount: minViewCount ? parseInt(minViewCount) : undefined,
        videoDuration: videoDuration as 'short' | 'medium' | 'long' | undefined,
        hasCaption: hasCaption === 'true',
        videoDefinition: videoDefinition as 'high' | undefined,
      });
      return NextResponse.json(searchResults);
    }

    return NextResponse.json(
      { error: 'Video ID veya arama sorgusu gerekli' },
      { status: 400 }
    );
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu' },
      { status: 500 }
    );
  }
} 