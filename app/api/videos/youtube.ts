// pages/api/youtube.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getVideoDetails, searchVideos } from '@/lib/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { videoId, query, channelId, publishedAfter, publishedBefore, maxResults, pageToken } = req.query;

    try {
      if (videoId && typeof videoId === 'string') {
        // Tekil video detaylarını getir
        const videoDetails = await getVideoDetails(videoId);
        return res.status(200).json(videoDetails);
      } else if (query && typeof query === 'string') {
        // Video araması yap
        const searchResults = await searchVideos({
          query,
          channelId: typeof channelId === 'string' ? channelId : undefined,
          publishedAfter: typeof publishedAfter === 'string' ? publishedAfter : undefined,
          publishedBefore: typeof publishedBefore === 'string' ? publishedBefore : undefined,
          maxResults: typeof maxResults === 'string' ? parseInt(maxResults) : undefined,
          pageToken: typeof pageToken === 'string' ? pageToken : undefined,
        });
        return res.status(200).json(searchResults);
      } else {
        return res.status(400).json({ error: 'Video ID veya arama sorgusu gerekli' });
      }
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
