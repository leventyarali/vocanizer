// View Types (Database view yapısı)
export interface WordViewBase {
  word_id: string;
  word: string;
  word_type_id: string | null;
  word_type_name: string | null;
  cefr_level: string | null;
  is_active: boolean;
  is_public: boolean;
  updated_at: string | null;
  created_at: string | null;
}

export interface WordViewMeaning {
  meaning_id: string | null;
  definition_tr: string | null;
  definition_en: string | null;
  detailed_definition_tr: string | null;
  detailed_definition_en: string | null;
  grammar_tr: string | null;
  grammar_en: string | null;
  hint_tr: string | null;
  hint_en: string | null;
  synonyms: string[] | null;
  antonyms: string[] | null;
  word_lists: string[] | null;
  word_family: string[] | null;
  word_forms: string[] | null;
}

export interface WordView extends WordViewBase, WordViewMeaning {}

// Frontend Types
export interface Word {
  id: string;
  word: string;
  word_type_id: string | null;
  word_type_name: string | null;
  cefr_level: string | null;
  is_active: boolean;
  is_public: boolean;
  updated_at: string | null;
  meanings: WordMeaning[];
}

export interface WordMeaning {
  id: string;
  word_id: string;
  word_type_name: string | null;
  cefr_level: string | null;
  definition_tr: string;
  definition_en: string;
  detailed_definition_tr: string | null;
  detailed_definition_en: string | null;
  grammar_tr: string | null;
  grammar_en: string | null;
  hint_tr: string | null;
  hint_en: string | null;
  synonyms: string[] | null;
  antonyms: string[] | null;
  word_lists: string[] | null;
  word_family: string[] | null;
  word_forms: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WordListItem {
  id: string;
  word: string;
  word_type_id: string | null;
  word_type_name: string | null;
  cefr_level: string | null;
  is_active: boolean;
  is_public: boolean;
  definition_tr: string | null;
  definition_en: string | null;
  is_oxford_3000: boolean;
  is_oxford_5000: boolean;
}

// Payload Types
export interface CreateWordPayload {
  word: string;
  word_type_id: string;
  cefr_level: string;
  is_active?: boolean;
  is_public?: boolean;
  meanings: Array<Omit<WordMeaning, 'id' | 'word_id'>>;
}

export interface UpdateWordPayload extends CreateWordPayload {
  id: string;
}

// View to Frontend conversion functions
export function viewToWord(view: WordView): Word {
  return {
    id: view.word_id,
    word: view.word,
    word_type_id: view.word_type_id,
    word_type_name: view.word_type_name,
    cefr_level: view.cefr_level,
    is_active: view.is_active,
    is_public: view.is_public,
    updated_at: view.updated_at,
    meanings: view.meaning_id ? [{
      id: view.meaning_id,
      word_id: view.word_id,
      word_type_name: view.word_type_name,
      cefr_level: view.cefr_level,
      definition_tr: view.definition_tr ?? '',
      definition_en: view.definition_en ?? '',
      detailed_definition_tr: view.detailed_definition_tr,
      detailed_definition_en: view.detailed_definition_en,
      grammar_tr: view.grammar_tr,
      grammar_en: view.grammar_en,
      hint_tr: view.hint_tr,
      hint_en: view.hint_en,
      synonyms: view.synonyms,
      antonyms: view.antonyms,
      word_lists: view.word_lists,
      word_family: view.word_family,
      word_forms: view.word_forms,
      created_at: view.created_at,
      updated_at: view.updated_at
    }] : []
  }
}

export function viewToWordList(view: any): WordListItem {
  return {
    id: view.word_id,
    word: view.word,
    word_type_id: view.word_type_id,
    word_type_name: view.word_type_name,
    cefr_level: view.cefr_level,
    is_active: view.is_active || false,
    is_public: view.is_public || false,
    definition_tr: view.definition_tr,
    definition_en: view.definition_en,
    is_oxford_3000: view.is_oxford_3000 || false,
    is_oxford_5000: view.is_oxford_5000 || false
  }
}

// Filter Types
export interface WordFilters {
  word?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';