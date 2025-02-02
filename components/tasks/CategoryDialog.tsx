"use client";

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTaskCategories } from "@/hooks/tasks/useTaskCategories"
import { TaskCategory } from "@/lib/types/task"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: TaskCategory
}

const CATEGORY_COLORS = [
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

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(CATEGORY_COLORS[0])
  const { createCategory, updateCategory } = useTaskCategories()

  useEffect(() => {
    if (category) {
      setName(category.name)
      setColor(category.color || CATEGORY_COLORS[0])
    } else {
      setName("")
      setColor(CATEGORY_COLORS[0])
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (category) {
        await updateCategory(category.id, { name, color })
        toast.success("Kategori güncellendi")
      } else {
        await createCategory({ name, color })
        toast.success("Kategori oluşturuldu")
      }
      setName("")
      setColor(CATEGORY_COLORS[0])
      onOpenChange(false)
    } catch (error) {
      console.error("Error with category:", error)
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Kategori Düzenle" : "Yeni Kategori"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı</Label>
            <Input
              id="name"
              placeholder="Kategori adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Renk</Label>
            <div className="grid grid-cols-10 gap-2">
              {CATEGORY_COLORS.map((c) => (
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
            <Button type="submit" disabled={!name.trim()}>
              {category ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 