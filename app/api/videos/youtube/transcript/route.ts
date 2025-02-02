import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const youtube = google.youtube('v3');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID gerekli' },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    });

    const response = await youtube.captions.list({
      auth,
      part: ['snippet'],
      videoId,
    });

    const captions = response.data.items;
    if (!captions || captions.length === 0) {
      return NextResponse.json({ transcript: 'Bu video için transkript bulunamadı' });
    }

    // Tercih edilen dilde altyazı varsa onu seç, yoksa ilkini al
    const caption = captions.find(c => c.snippet?.language === 'en') || captions[0];
    
    const transcriptResponse = await youtube.captions.download({
      auth,
      id: caption.id!,
      tfmt: 'srt',
    });

    const transcript = transcriptResponse.data;
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transkript alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 