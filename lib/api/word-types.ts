import { WordType } from '@/lib/types/word';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface WordTypeResponse {
  data: WordType | null;
  error: Error | null;
}

export interface WordTypesResponse {
  data: WordType[] | null;
  error: Error | null;
}

export async function getWordTypes(): Promise<WordTypesResponse> {
  try {
    const { data, error } = await supabase
      .from('word_types')
      .select('*')
      .order('name');

    if (error) throw error;

    return {
      data: data as WordType[],
      error: null,
    };
  } catch (error) {
    console.error('Kelime türleri yüklenirken hata oluştu:', error);
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function getWordType(id: number): Promise<WordTypeResponse> {
  try {
    const { data, error } = await supabase
      .from('word_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: data as WordType,
      error: null,
    };
  } catch (error) {
    console.error('Kelime türü yüklenirken hata oluştu:', error);
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function createWordType(name: string): Promise<WordTypeResponse> {
  try {
    const { data, error } = await supabase
      .from('word_types')
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as WordType,
      error: null,
    };
  } catch (error) {
    console.error('Kelime türü oluşturulurken hata oluştu:', error);
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateWordType(
  id: number,
  name: string,
): Promise<WordTypeResponse> {
  try {
    const { data, error } = await supabase
      .from('word_types')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as WordType,
      error: null,
    };
  } catch (error) {
    console.error('Kelime türü güncellenirken hata oluştu:', error);
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteWordType(id: number): Promise<void> {
  const { error } = await supabase.from('word_types').delete().eq('id', id);

  if (error) {
    console.error('Kelime türü silinirken hata oluştu:', error);
    throw error;
  }
} 