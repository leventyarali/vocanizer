import { Database } from "../supabase/database.types";

export type Sentence = Database["public"]["Tables"]["sentences"]["Row"];

export interface Translation {
  id: string;
  text: string;
  language_id: string;
}

export interface SentenceListItem {
  id: string;
  text: string;
  language_id: string;
  cefr_level: Database["public"]["Enums"]["cefr_level"] | null;
  difficulty_level: number | null;
  created_at: string | null;
  updated_at: string | null;
  translations?: Translation[];
}

export interface SentenceFormData {
  text: string;
  language_id: string;
  cefr_level: Database["public"]["Enums"]["cefr_level"] | null;
  difficulty_level: number;
  source_text_id?: string | null;
  original_sentence_id?: string | null;
  translation?: string;
}

export const DIFFICULTY_LEVELS = {
  1: 'Kolay',
  2: 'Orta',
  3: 'Zor'
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS; 