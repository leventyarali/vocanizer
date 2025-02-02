"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

interface Task {
  id?: string;
  title: string;
  description: string;
  category_id: string;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  list_id?: string;
}

interface TaskDialogProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Task) => void;
  categories: Array<{ id: string; name: string }>;
}

export function TaskDialog({ task, isOpen, onClose, onSubmit, categories }: TaskDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData: Task = {
      id: task?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category_id: formData.get('category') as string,
      due_date: formData.get('dueDate') as string,
      is_completed: task?.is_completed || false,
      created_at: task?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      list_id: task?.list_id
    };
    onSubmit(taskData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>{task ? 'Görevi Düzenle' : 'Yeni Görev'}</DialogTitle>
            <DialogDescription>
              Görev detaylarını girin ve kaydedin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Görev başlığı"
                  defaultValue={task?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Görev açıklaması"
                  defaultValue={task?.description}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={task?.category_id}
                  required
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Bitiş Tarihi</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  defaultValue={task?.due_date}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit">
                {task ? 'Güncelle' : 'Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 