import { Task } from "@/lib/types/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"; // Sabit UUID

export function useTaskMutations() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const getMaxOrderIndex = async (listId?: string) => {
    const query = supabase
      .from("tasks")
      .select("order_index")
      .eq("user_id", DEFAULT_USER_ID)
      .order("order_index", { ascending: false })
      .limit(1);

    if (listId) {
      query.eq("list_id", listId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Görev sırası alınırken bir hata oluştu: ${error.message}`);
    }

    return data?.[0]?.order_index || 0;
  };

  const createTask = async (task: Partial<Task>) => {
    try {
      const maxOrderIndex = await getMaxOrderIndex(task.list_id);

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...task,
          user_id: DEFAULT_USER_ID,
          order_index: maxOrderIndex + 1,
          is_completed: false,
          is_starred: false
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating task:", error);
        throw new Error(`Görev oluşturulurken bir hata oluştu: ${error.message}`);
      }

      router.refresh();
      return data;
    } catch (err) {
      console.error("Error in createTask:", err);
      throw err;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .eq("user_id", DEFAULT_USER_ID)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      throw new Error(`Görev güncellenirken bir hata oluştu: ${error.message}`);
    }

    router.refresh();
    return data;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", DEFAULT_USER_ID);

    if (error) {
      console.error("Error deleting task:", error);
      throw new Error(`Görev silinirken bir hata oluştu: ${error.message}`);
    }

    router.refresh();
  };

  return {
    createTask,
    updateTask,
    deleteTask,
  };
} 