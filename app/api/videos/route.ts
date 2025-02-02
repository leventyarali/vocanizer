import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      url,
      thumbnailUrl,
      metadata,
      media_type,
      status,
    } = body;

    console.log('Creating video with data:', {
      title,
      url,
      media_type,
      status,
      metadata,
    });

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title,
          description,
          url,
          thumbnail_url: thumbnailUrl,
          metadata,
          media_type,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Video kaydedilirken bir hata oluştu: ${error.message}`);
    }

    console.log('Video created successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Video oluşturulurken bir hata oluştu',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const media_type = searchParams.get('media_type');

    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (media_type) {
      query = query.eq('media_type', media_type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Videolar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 