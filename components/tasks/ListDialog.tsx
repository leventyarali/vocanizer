"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTaskCategories } from "@/hooks/tasks/useTaskCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCategory, TaskList } from "@/lib/types/task";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list?: TaskList;
  categoryId?: string;
}

const LIST_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#a855f7", // purple
  "#ec4899", // pink
];

export function ListDialog({ open, onOpenChange, list, categoryId }: ListDialogProps) {
  const [name, setName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [color, setColor] = useState(LIST_COLORS[0]);
  const { createList, updateList, categories } = useTaskCategories();

  useEffect(() => {
    if (list) {
      setName(list.name);
      setSelectedCategoryId(list.category_id);
      setColor(list.color || LIST_COLORS[0]);
    } else {
      setName("");
      setSelectedCategoryId(categoryId || "");
      setColor(LIST_COLORS[0]);
    }
  }, [list, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedCategoryId) {
        throw new Error("Lütfen bir kategori seçin");
      }

      if (list) {
        await updateList(list.id, { 
          name, 
          category_id: selectedCategoryId,
          color
        });
        toast.success("Liste güncellendi");
      } else {
        await createList({ 
          name, 
          category_id: selectedCategoryId,
          color
        });
        toast.success("Liste oluşturuldu");
      }
      setName("");
      setSelectedCategoryId("");
      setColor(LIST_COLORS[0]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error with list:", error);
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{list ? "Liste Düzenle" : "Yeni Liste"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Liste Adı</Label>
            <Input
              id="name"
              placeholder="Liste adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select 
              value={selectedCategoryId} 
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Renk</Label>
            <div className="grid grid-cols-10 gap-2">
              {LIST_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "h-6 w-6 rounded-full ring-offset-2 transition-all hover:scale-110",
                    color === c && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={!name.trim() || !selectedCategoryId}>
              {list ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 