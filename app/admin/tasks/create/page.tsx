"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskDialog } from "@/components/tasks/TaskDialog";

export default function TaskCreatePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      router.back();
    }
  }, [isOpen, router]);

  return (
    <TaskDialog
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
