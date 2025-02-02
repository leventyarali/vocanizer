"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTask } from "@/hooks/tasks/useTask";
import { TaskDialog } from "@/components/tasks/TaskDialog";

interface TaskEditPageProps {
  params: {
    taskId: string;
  };
}

export default function TaskEditPage({ params }: TaskEditPageProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { task, isLoading } = useTask(params.taskId);

  useEffect(() => {
    if (!isOpen) {
      router.back();
    }
  }, [isOpen, router]);

  if (isLoading) {
    return null;
  }

  return (
    <TaskDialog
      task={task}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
