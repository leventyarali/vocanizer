"use client";

import { Task } from "@/lib/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar, Paperclip, ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useTask } from "@/hooks/tasks/useTask";

interface TaskCardProps {
  task: Task;
  onSelect?: (taskId: string, selected: boolean) => void;
  isSelected?: boolean;
}

export function TaskCard({ task, onSelect, isSelected = false }: TaskCardProps) {
  const { toggleComplete, toggleStar } = useTask({ initialTask: task });

  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg hover:shadow-sm transition-all cursor-pointer group",
        isSelected && "border-primary",
        task.is_completed && "opacity-50"
      )}
      onClick={() => onSelect?.(task.id, !isSelected)}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 cursor-grab" />
        
        <Checkbox 
          checked={task.is_completed}
          className="mt-1"
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete(task.id, !task.is_completed);
          }}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-medium truncate",
              task.is_completed && "line-through"
            )}>
              {task.title}
            </h3>
            <button
              className="p-1 rounded-full hover:bg-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(task.id, !task.is_starred);
              }}
            >
              <Star className={cn(
                "h-4 w-4",
                task.is_starred ? "text-yellow-400 fill-current" : "text-slate-400"
              )} />
            </button>
          </div>
          
          {task.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-2">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              priorityColors[task.priority]
            )}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "d MMM", { locale: tr })}
              </span>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}
              </span>
            )}
            
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="text-xs text-slate-500">
                {task.subtasks.filter(st => st.is_completed).length}/{task.subtasks.length} alt görev
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-slate-400" />
      </div>
    </div>
  );
} 