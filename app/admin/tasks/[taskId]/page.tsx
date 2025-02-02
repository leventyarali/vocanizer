"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Upload, Star, Calendar, AlertCircle } from "lucide-react";
import { useTask } from "@/hooks/tasks/useTask";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TaskDetailPageProps {
  params: {
    taskId: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    task,
    isLoading,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addAttachment,
    deleteAttachment
  } = useTask(params.taskId);

  const handleDelete = async () => {
    try {
      await deleteTask();
      router.push("/admin/tasks/list");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddSubtask = async (title: string) => {
    try {
      await addSubtask(title);
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      await toggleSubtask(subtaskId, completed);
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await deleteSubtask(subtaskId);
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await addAttachment(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId);
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Görev Bulunamadı</h2>
        <p className="text-muted-foreground mb-4">
          Aradığınız görev silinmiş veya taşınmış olabilir.
        </p>
        <Button onClick={() => router.push("/admin/tasks/list")}>
          Görevlere Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(task.due_date), "PPP", { locale: tr })}
              </div>
            )}
            <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
              {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
            </Badge>
            {task.is_starred && (
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/tasks/${params.taskId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Açıklama</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description || "Açıklama yok"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Alt Görevler</h2>
              <div className="space-y-2">
                {task.subtasks?.map(subtask => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.is_completed}
                        onChange={(e) => handleToggleSubtask(subtask.id, e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className={cn(
                        subtask.is_completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Dosya Ekleri</h2>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Dosya Yükle
                </Button>
                <div className="space-y-2">
                  {task.attachments?.map(attachment => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-slate-50"
                    >
                      <span className="truncate flex-1">
                        {attachment.file_name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 