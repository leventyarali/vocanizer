// app/api/test/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Basit bir sorgu yapalım - words tablosundan ilk 3 kelimeyi çekelim
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .limit(3);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server connection failed' }, 
      { status: 500 }
    );
  }
}