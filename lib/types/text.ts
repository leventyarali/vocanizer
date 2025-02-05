import { Database } from "../supabase/database.types";

export type Text = Database["public"]["Tables"]["texts"]["Row"];

export interface TextListItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  cefr_level?: Database["public"]["Enums"]["cefr_level"] | null;
  content_type: Database["public"]["Enums"]["content_type"];
  language_id: string;
  source_name?: string;
  source_url?: string;
  word_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TextFormData {
  title: string;
  content: string;
  summary?: string;
  cefr_level?: Database["public"]["Enums"]["cefr_level"];
  content_type: Database["public"]["Enums"]["content_type"];
  language_id: string;
  source_name?: string;
  source_url?: string;
  is_active?: boolean;
}

export const CONTENT_TYPES = {
  article: 'Makale',
  story: 'Hikaye',
  exercise: 'Alıştırma',
  quiz: 'Quiz',
  vocabulary: 'Kelime Listesi'
} as const;

export type ContentType = keyof typeof CONTENT_TYPES; 