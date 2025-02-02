// pages/api/videos/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { validateVideo } from '@/lib/validations/video';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body;
    const errors = validateVideo(data);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const { data: newVideo, error } = await supabase
        .from('media')
        .insert([data])
        .single();

      if (error) throw error;

      res.status(201).json(newVideo);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else if (req.method === 'GET') {
    const { search, language, level, type, status } = req.query;

    let query = supabase.from('media').select('*');

    if (search && typeof search === 'string') {
      query = query.ilike('title', `%${search}%`);
    }
    if (language && typeof language === 'string') {
      query = query.eq('language_id', language);
    }
    if (level && typeof level === 'string') {
      query = query.eq('cefr_level', level);
    }
    if (type && typeof type === 'string') {
      query = query.eq('type', type);
    }
    if (status && typeof status === 'string') {
      query = query.eq('status', status);
    }

    try {
      const { data, error } = await query;

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
