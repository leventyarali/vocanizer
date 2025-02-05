import { createClient } from "@/lib/supabase/server";
import { Text, TextFormData } from "@/lib/types/text";
import { ApiResponse } from "@/lib/types/api";

interface TextFilters {
  title?: string;
  content_type?: string;
  cefr_level?: string;
  language_id?: string;
}

export async function getTexts(
  page: number = 1,
  limit: number = 10,
  filters?: TextFilters
): Promise<ApiResponse<Text[]>> {
  const supabase = await createClient();
  
  let query = supabase
    .from('texts')
    .select('*', { count: 'exact' })
    .range((page - 1) * limit, page * limit - 1);

  // Filtreleri uygula
  if (filters?.title) {
    query = query.ilike('title', `%${filters.title}%`);
  }
  if (filters?.content_type) {
    query = query.eq('content_type', filters.content_type);
  }
  if (filters?.cefr_level) {
    query = query.eq('cefr_level', filters.cefr_level);
  }
  if (filters?.language_id) {
    query = query.eq('language_id', filters.language_id);
  }

  const { data, error, count } = await query;

  if (error) {
    return { error };
  }

  return {
    data,
    metadata: {
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      pageSize: limit
    }
  };
}

export async function getText(id: string): Promise<ApiResponse<Text>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('texts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { error };
  }

  return { data };
}

export async function createText(text: TextFormData): Promise<ApiResponse<Text>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('texts')
    .insert([text])
    .select()
    .single();

  if (error) {
    return { error };
  }

  return { data };
}

export async function updateText(
  id: string,
  text: Partial<TextFormData>
): Promise<ApiResponse<Text>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('texts')
    .update(text)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error };
  }

  return { data };
}

export async function deleteText(id: string): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('texts')
    .delete()
    .eq('id', id);

  if (error) {
    return { error };
  }

  return { data: null };
} 