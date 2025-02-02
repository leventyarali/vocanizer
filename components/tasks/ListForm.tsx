"use client";

import { TaskList } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ListFormProps {
  list?: TaskList;
  categoryId?: string;
  onSubmit: (data: Partial<TaskList>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

export function ListForm({ list, categoryId, onSubmit, onCancel, isLoading = false, error }: ListFormProps) {
  const [name, setName] = useState(list?.name || "");
  const [color, setColor] = useState(list?.color || "#4F46E5");
  const [validationError, setValidationError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    if (!name.trim()) {
      setValidationError("Liste adı gereklidir");
      return;
    }

    if (!color.match(/^#[0-9A-Fa-f]{6}$/)) {
      setValidationError("Geçerli bir renk kodu giriniz");
      return;
    }

    try {
      const data: Partial<TaskList> = {
        name: name.trim(),
        color,
        category_id: categoryId
      };

      if (list?.id) {
        data.id = list.id;
      }

      await onSubmit(data);
    } catch (err) {
      setValidationError("Liste kaydedilirken bir hata oluştu");
      console.error('Error saving list:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Liste Adı
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Liste adı"
          className={cn(validationError && "border-red-500")}
          required
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Renk
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 p-1 cursor-pointer"
            />
            <div 
              className="absolute inset-0 pointer-events-none rounded border border-input"
              style={{ backgroundColor: color }}
            />
          </div>
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            className={cn("flex-1 uppercase", validationError && "border-red-500")}
          />
        </div>
      </div>

      {(validationError || error) && (
        <Alert variant="destructive">
          <AlertDescription>
            {validationError || error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          İptal
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? "Kaydediliyor..." : list?.id ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
} 