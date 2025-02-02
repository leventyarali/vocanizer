import { createClient } from '@/lib/supabase/server'
import { 
  Word, 
  WordFilters,
  WordListItem,
  CreateWordPayload,
  UpdateWordPayload,
  WordView,
  viewToWord,
  viewToWordList,
  WordMeaning
} from '@/lib/types/word'
import { PostgrestError } from '@supabase/supabase-js'

// Response Types
export type WordsResponse = {
  data: WordListItem[] | null
  error: PostgrestError | null
  count: number | null
  metadata?: {
    page: number
    limit: number
    totalPages: number
  }
}

export type WordResponse = {
  data: Word | null
  error: PostgrestError | null
}

// Helper function to get Supabase client
const getSupabase = async () => await createClient()

/**
 * Get paginated word list with filters
 */
export async function getWords(
  page = 1,
  limit = 10,
  filters?: WordFilters,
  orderBy = 'word',
  orderDirection: 'asc' | 'desc' = 'asc'
): Promise<WordsResponse> {
  try {
    const supabase = await getSupabase()
    const start = (page - 1) * limit
    
    let query = supabase
      .from('v_word_list')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(start, start + limit - 1)

    // Apply filters if provided
    if (filters?.word) {
      query = query.ilike('word', `${filters.word}%`)
    }

    const { data: viewData, error, count } = await query

    if (error) throw error

    const data = viewData?.map(viewToWordList) ?? null

    return {
      data,
      error: null,
      count,
      metadata: {
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    }
  } catch (error) {
    console.error('Error fetching words:', error)
    return {
      data: null,
      error: error as PostgrestError,
      count: null,
      metadata: {
        page,
        limit,
        totalPages: 0
      }
    }
  }
}

/**
 * Get single word with meanings and definitions
 */
export async function getWord(id: string): Promise<WordResponse> {
  try {
    const supabase = await getSupabase()
    
    // Fetch word details
    const { data: viewData, error } = await supabase
      .from('v_word_base_detail')
      .select('*')
      .eq('word_id', id)
      .order('meaning_id')

    if (error) {
      return {
        data: null,
        error
      }
    }

    if (!viewData || viewData.length === 0) {
      return {
        data: null,
        error: new Error('Word not found') as PostgrestError
      }
    }

    // Kelime temel bilgileri
    const baseWord: Word = {
      id: viewData[0].word_id,
      word: viewData[0].word,
      word_type_id: viewData[0].word_type_id,
      word_type_name: viewData[0].word_type_name,
      cefr_level: viewData[0].cefr_level,
      is_active: viewData[0].is_active,
      is_public: viewData[0].is_public,
      updated_at: viewData[0].updated_at,
      meanings: []
    }

    // Anlamları ekle
    baseWord.meanings = viewData
      .filter(item => item.meaning_id) // null meaning_id'leri filtrele
      .map(item => ({
        id: item.meaning_id!,
        word_id: item.word_id,
        word_type_name: item.word_type_name,
        cefr_level: item.cefr_level,
        definition_tr: item.definition_tr ?? '',
        definition_en: item.definition_en ?? '',
        detailed_definition_tr: item.detailed_definition_tr,
        detailed_definition_en: item.detailed_definition_en,
        grammar_tr: item.grammar_tr,
        grammar_en: item.grammar_en,
        hint_tr: item.hint_tr,
        hint_en: item.hint_en,
        synonyms: item.synonyms,
        antonyms: item.antonyms,
        word_lists: item.word_lists,
        word_family: item.word_family,
        word_forms: item.word_forms,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))

    return {
      data: baseWord,
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

/**
 * Create new word with meanings using transaction
 */
export async function createWord(payload: CreateWordPayload): Promise<WordResponse> {
  const supabase = await getSupabase()
  
  try {
    const { data, error } = await supabase.rpc('create_word', {
      word_data: {
        word: payload.word,
        word_type_id: payload.word_type_id,
        cefr_level: payload.cefr_level,
        is_active: payload.is_active ?? true,
        is_public: payload.is_public ?? true,
        meanings: payload.meanings
      }
    })

    if (error) throw error

    return await getWord(data.word_id)
  } catch (error) {
    console.error('Error creating word:', error)
    return {
      data: null, 
      error: error as PostgrestError
    }
  }
}

/**
 * Update existing word with meanings using transaction
 */
export async function updateWord(payload: UpdateWordPayload): Promise<WordResponse> {
  const supabase = await getSupabase()
  
  try {
    const { error } = await supabase.rpc('update_word', {
      word_data: {
        id: payload.id,
        word: payload.word,
        word_type_id: payload.word_type_id,
        cefr_level: payload.cefr_level,
        is_active: payload.is_active,
        is_public: payload.is_public,
        meanings: payload.meanings
      }
    })

    if (error) throw error

    return await getWord(payload.id)
  } catch (error) {
    console.error('Error updating word:', error) 
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

/**
 * Soft delete word by marking deleted_at
 */
export async function deleteWord(id: string): Promise<void> {
  const supabase = await getSupabase()
  
  const { error } = await supabase
    .from('words')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error deleting word:', error)
    throw error
  }
}

export async function updateWordMeaning(meaningId: string, data: Partial<WordMeaning>) {
  try {
    const supabase = await getSupabase();
    
    // Güncelleme işlemini gerçekleştir
    const { data: result, error } = await supabase
      .from('word_meanings')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', meaningId)
      .select('*')
      .single();

    if (error) {
      console.error('Güncelleme hatası:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Kelime anlamı güncellenirken hata:', error);
    throw error;
  }
}