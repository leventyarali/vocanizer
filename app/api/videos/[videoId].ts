// pages/api/videos/[videoId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { validateVideo } from '@/lib/validations/video';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', videoId)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Video not found' });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else if (req.method === 'PUT') {
    const data = req.body;
    const errors = validateVideo(data);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const { data: updatedVideo, error } = await supabase
        .from('media')
        .update(data)
        .eq('id', videoId)
        .single();

      if (error) throw error;

      res.status(200).json(updatedVideo);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
