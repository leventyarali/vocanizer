"use server"

import { createClient } from '@/lib/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'
import { Sentence, SentenceListItem, SentenceFormData } from '@/lib/types/sentence'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Response Types
export type SentencesResponse = {
  data: SentenceListItem[] | null
  error: PostgrestError | null
}

export type SentenceResponse = {
  data: Sentence | null
  error: PostgrestError | null
}

const getSupabase = async () => await createClient()

// Server Actions
export async function createSentenceAction(data: SentenceFormData) {
  const response = await createSentence(data)
  
  if (response.error) {
    throw response.error
  }

  revalidatePath("/admin/content/sentences")
  redirect("/admin/content/sentences")
}

export async function updateSentenceAction(id: string, data: SentenceFormData) {
  const response = await updateSentence(id, data)
  
  if (response.error) {
    throw response.error
  }

  revalidatePath("/admin/content/sentences")
  redirect("/admin/content/sentences")
}

// API Functions
export async function getSentences(search?: string): Promise<SentencesResponse> {
  try {
    const supabase = await getSupabase()
    
    let query = supabase
      .from('sentences')
      .select(`
        id, 
        text, 
        language_id, 
        cefr_level, 
        difficulty_level, 
        created_at, 
        updated_at,
        translations:sentences!original_sentence_id(
          id,
          text,
          language_id
        )
      `)
      .eq('language_id', '2201c7e1-50db-4711-af5a-c0fc254b6c39')
      .is('original_sentence_id', null)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('text', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return {
        data: null,
        error
      }
    }

    return {
      data: data as SentenceListItem[],
      error: null
    }
  } catch (error: unknown) {
    console.error('Cümle yükleme hatası:', error)
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

export async function getSentence(id: string): Promise<SentenceResponse> {
  try {
    const supabase = await getSupabase()
    
    const { data, error } = await supabase
      .from('sentences')
      .select(`
        id,
        text,
        language_id,
        cefr_level,
        difficulty_level,
        source_text_id,
        original_sentence_id,
        created_at,
        updated_at,
        approved_at,
        approved_by,
        languages!language_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return {
      data,
      error: null
    }
  } catch (error: unknown) {
    console.error('Cümle yükleme hatası:', error)
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

export async function createSentence(data: SentenceFormData): Promise<SentenceResponse> {
  try {
    const supabase = await getSupabase()
    
    const sentenceData = {
      ...data,
      difficulty_level: data.difficulty_level || 1,
      language_id: data.language_id || "en",
      cefr_level: data.cefr_level || null
    }
    
    const { data: newSentence, error } = await supabase
      .from('sentences')
      .insert([sentenceData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      data: newSentence,
      error: null
    }
  } catch (error: unknown) {
    console.error('Cümle oluşturma hatası:', error)
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

export async function updateSentence(id: string, data: Partial<SentenceFormData>): Promise<SentenceResponse> {
  try {
    const supabase = await getSupabase()
    
    const sentenceData = {
      ...data,
      difficulty_level: data.difficulty_level || 1,
      language_id: data.language_id || "en",
      cefr_level: data.cefr_level || null
    }
    
    const { data: updatedSentence, error } = await supabase
      .from('sentences')
      .update(sentenceData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      data: updatedSentence,
      error: null
    }
  } catch (error: unknown) {
    console.error('Cümle güncelleme hatası:', error)
    return {
      data: null,
      error: error as PostgrestError
    }
  }
}

export async function deleteSentence(id: string): Promise<void> {
  try {
    const supabase = await getSupabase()
    
    const { error } = await supabase
      .from('sentences')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting sentence:', error.message)
    } else {
      console.error('Error deleting sentence:', error)
    }
    throw error
  }
} 