import { useState, useEffect } from "react";
import { TaskCategory, TaskList } from "@/lib/types/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/components/providers/auth-provider";

export function useTaskCategories() {
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("task_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (supabaseError) {
        throw new Error(`Kategoriler yüklenirken bir hata oluştu: ${supabaseError.message}`);
      }
      setCategories(data || []);
    } catch (err) {
      console.error("Kategori yükleme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLists = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("task_lists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (supabaseError) {
        throw new Error(`Listeler yüklenirken bir hata oluştu: ${supabaseError.message}`);
      }
      setLists(data || []);
    } catch (err) {
      console.error("Liste yükleme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (category: Partial<TaskCategory>) => {
    if (!user) throw new Error("Oturum açmanız gerekiyor");
    
    try {
      if (!category.name?.trim()) {
        throw new Error("Kategori adı boş olamaz");
      }

      const { data, error: supabaseError } = await supabase
        .from("task_categories")
        .insert({
          ...category,
          user_id: user.id
        })
        .select()
        .single();

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          throw new Error("Bu isimde bir kategori zaten mevcut");
        }
        throw new Error(`Kategori oluşturulurken bir hata oluştu: ${supabaseError.message}`);
      }
      
      if (!data) {
        throw new Error("Kategori oluşturuldu fakat veri dönmedi");
      }
      
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Kategori oluşturma hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  const updateCategory = async (categoryId: string, updates: Partial<TaskCategory>) => {
    try {
      if (!updates.name?.trim()) {
        throw new Error("Kategori adı boş olamaz");
      }

      const { data, error: supabaseError } = await supabase
        .from("task_categories")
        .update(updates)
        .eq("id", categoryId)
        .select()
        .single();

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          throw new Error("Bu isimde bir kategori zaten mevcut");
        }
        throw new Error(`Kategori güncellenirken bir hata oluştu: ${supabaseError.message}`);
      }
      
      if (!data) {
        throw new Error("Kategori güncellendi fakat veri dönmedi");
      }
      
      setCategories(prev => prev.map(c => c.id === categoryId ? data : c));
      return data;
    } catch (err) {
      console.error("Kategori güncelleme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("task_categories")
        .delete()
        .eq("id", categoryId);

      if (supabaseError) {
        throw new Error(`Kategori silinirken bir hata oluştu: ${supabaseError.message}`);
      }
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      console.error("Kategori silme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  const createList = async (list: Partial<TaskList>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("task_lists")
        .insert({
          ...list,
          user_id: user.id
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Liste oluşturulurken bir hata oluştu: ${supabaseError.message}`);
      }
      
      if (!data) {
        throw new Error("Liste oluşturuldu fakat veri dönmedi");
      }
      
      setLists(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Liste oluşturma hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  const updateList = async (listId: string, updates: Partial<TaskList>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("task_lists")
        .update(updates)
        .eq("id", listId)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Liste güncellenirken bir hata oluştu: ${supabaseError.message}`);
      }
      
      if (!data) {
        throw new Error("Liste güncellendi fakat veri dönmedi");
      }
      
      setLists(prev => prev.map(l => l.id === listId ? data : l));
      return data;
    } catch (err) {
      console.error("Liste güncelleme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  const deleteList = async (listId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("task_lists")
        .delete()
        .eq("id", listId);

      if (supabaseError) {
        throw new Error(`Liste silinirken bir hata oluştu: ${supabaseError.message}`);
      }
      setLists(prev => prev.filter(l => l.id !== listId));
    } catch (err) {
      console.error("Liste silme hatası:", err);
      const error = err instanceof Error ? err : new Error("Bilinmeyen bir hata oluştu");
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchLists();
    }
  }, [user]);

  return {
    categories,
    lists,
    isLoading,
    error,
    fetchCategories,
    fetchLists,
    createCategory,
    updateCategory,
    deleteCategory,
    createList,
    updateList,
    deleteList
  };
} 