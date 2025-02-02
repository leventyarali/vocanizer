'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL ve Key tanımlanmamış!');
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseKey
);

export const createClient = () => {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  );
};




