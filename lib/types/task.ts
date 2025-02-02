export type TaskPriority = "low" | "medium" | "high";

export type TaskRecurrence = {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  days?: number[];
  endDate?: string;
  count?: number;
};

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface TaskList {
  id: string;
  category_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  order_index: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  is_completed: boolean;
  is_starred: boolean;
  due_date?: string;
  list_id?: string;
  category_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  subtasks?: TaskSubtask[];
  attachments?: TaskAttachment[];
  recurrence?: TaskRecurrence;
  order_index: number;
  parent_task_id?: string;
}

export interface TaskSubtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  updated_at: string;
} 