import { useState, useEffect } from "react";
import { Task, TaskPriority } from "@/lib/types/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/components/providers/auth-provider";

interface TaskFilters {
  search?: string;
  priority?: TaskPriority;
  status?: 'all' | 'completed' | 'active';
  list_id?: string;
  category_id?: string;
  is_starred?: boolean;
  due_date?: string;
}

interface UseTasksProps {
  list_id?: string;
}

export function useTasks({ list_id }: UseTasksProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ list_id });

  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("tasks")
        .select(`
          *,
          subtasks (
            *
          ),
          attachments (
            *
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }

      if (filters.status === "completed") {
        query = query.eq("is_completed", true);
      } else if (filters.status === "active") {
        query = query.eq("is_completed", false);
      }

      if (filters.list_id) {
        query = query.eq("list_id", filters.list_id);
      }

      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters.is_starred !== undefined) {
        query = query.eq("is_starred", filters.is_starred);
      }

      if (filters.due_date) {
        query = query.eq("due_date", filters.due_date);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw new Error(supabaseError.message);
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: Partial<Task>) => {
    if (!user) throw new Error("Oturum açmanız gerekiyor");
    
    try {
      const { data, error: supabaseError } = await supabase
        .from("tasks")
        .insert({
          ...task,
          user_id: user.id
        })
        .select()
        .single();

      if (supabaseError) throw new Error(supabaseError.message);
      
      if (!data) {
        throw new Error("Görev oluşturuldu fakat veri dönmedi");
      }
      
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error creating task:", err);
      const error = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) throw new Error("Oturum açmanız gerekiyor");
    
    try {
      const { data, error: supabaseError } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (supabaseError) throw new Error(supabaseError.message);
      
      if (!data) {
        throw new Error("Görev güncellendi fakat veri dönmedi");
      }
      
      setTasks(prev => prev.map(t => t.id === taskId ? data : t));
      return data;
    } catch (err) {
      console.error("Error updating task:", err);
      const error = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) throw new Error("Oturum açmanız gerekiyor");
    
    try {
      const { error: supabaseError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", user.id);

      if (supabaseError) throw new Error(supabaseError.message);
      
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      const error = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      throw error;
    }
  };

  const applyFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const reorderTasks = async (taskId: string, newIndex: number) => {
    if (!user) throw new Error("Oturum açmanız gerekiyor");
    
    try {
      const { error: supabaseError } = await supabase.rpc("reorder_tasks", {
        p_task_id: taskId,
        p_new_index: newIndex,
        p_list_id: filters.list_id,
        p_user_id: user.id
      });

      if (supabaseError) throw new Error(supabaseError.message);
      await fetchTasks();
    } catch (err) {
      console.error("Error reordering tasks:", err);
      const error = err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [filters, user]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    applyFilters,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    fetchTasks
  };
} 