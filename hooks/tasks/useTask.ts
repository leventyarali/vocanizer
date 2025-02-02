import { useState, useEffect } from "react";
import { Task } from "@/lib/types/task";
import { createClient } from "@/lib/supabase/client";

export function useTask(taskId?: string) {
  const [task, setTask] = useState<Task>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const supabase = createClient();

  const fetchTask = async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          subtasks (*),
          attachments (*)
        `)
        .eq("id", taskId)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!taskId) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addSubtask = async (title: string) => {
    if (!taskId) return;

    try {
      const { data, error } = await supabase
        .from("subtasks")
        .insert({
          task_id: taskId,
          title,
          is_completed: false
        })
        .select()
        .single();

      if (error) throw error;

      setTask(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subtasks: [...(prev.subtasks || []), data]
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const toggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!taskId) return;

    try {
      const { error } = await supabase
        .from("subtasks")
        .update({ is_completed: completed })
        .eq("id", subtaskId)
        .eq("task_id", taskId);

      if (error) throw error;

      setTask(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks?.map(subtask =>
            subtask.id === subtaskId
              ? { ...subtask, is_completed: completed }
              : subtask
          )
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    if (!taskId) return;

    try {
      const { error } = await supabase
        .from("subtasks")
        .delete()
        .eq("id", subtaskId)
        .eq("task_id", taskId);

      if (error) throw error;

      setTask(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks?.filter(subtask => subtask.id !== subtaskId)
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addAttachment = async (file: File) => {
    if (!taskId) return;

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(`tasks/${taskId}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("attachments")
        .insert({
          task_id: taskId,
          file_name: fileName,
          file_path: `tasks/${taskId}/${fileName}`,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      setTask(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          attachments: [...(prev.attachments || []), data]
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    if (!taskId) return;

    try {
      const { data: attachment, error: fetchError } = await supabase
        .from("attachments")
        .select("file_path")
        .eq("id", attachmentId)
        .eq("task_id", taskId)
        .single();

      if (fetchError) throw fetchError;

      const { error: deleteStorageError } = await supabase.storage
        .from("attachments")
        .remove([attachment.file_path]);

      if (deleteStorageError) throw deleteStorageError;

      const { error } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("task_id", taskId);

      if (error) throw error;

      setTask(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          attachments: prev.attachments?.filter(a => a.id !== attachmentId)
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return {
    task,
    isLoading,
    error,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addAttachment,
    deleteAttachment
  };
} 