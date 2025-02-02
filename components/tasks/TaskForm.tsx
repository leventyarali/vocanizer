"use client";

import { Task, TaskPriority, TaskRecurrence } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading = false, error }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isRecurring, setIsRecurring] = useState(!!task?.recurrence);
  const [recurrence, setRecurrence] = useState<TaskRecurrence | undefined>(task?.recurrence);
  const [validationError, setValidationError] = useState<string>();

  // Client-side state initialization
  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "medium");
    setDueDate(task?.due_date ? new Date(task.due_date) : undefined);
    setIsRecurring(!!task?.recurrence);
    setRecurrence(task?.recurrence);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    if (!title.trim()) {
      setValidationError("Görev başlığı gereklidir");
      return;
    }

    try {
      const data: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate?.toISOString(),
        recurrence: isRecurring ? recurrence : undefined
      };

      if (task?.id) {
        data.id = task.id;
      }

      await onSubmit(data);
    } catch (err) {
      setValidationError("Görev kaydedilirken bir hata oluştu");
      console.error('Error saving task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Başlık
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Görev başlığı"
          className={cn(validationError && "border-red-500")}
          required
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Açıklama
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Görev açıklaması"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Öncelik
          </label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TaskPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Öncelik seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Düşük</SelectItem>
              <SelectItem value="medium">Orta</SelectItem>
              <SelectItem value="high">Yüksek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Bitiş Tarihi
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: tr }) : "Tarih seçin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecurring"
            checked={isRecurring}
            onCheckedChange={(checked) => {
              setIsRecurring(!!checked);
              if (checked && !recurrence) {
                setRecurrence({
                  frequency: "daily",
                  interval: 1
                });
              }
            }}
          />
          <Label htmlFor="isRecurring" className="flex items-center">
            <Repeat className="h-4 w-4 mr-2" />
            Tekrarla
          </Label>
        </div>

        {isRecurring && recurrence && (
          <div className="pl-6 space-y-4">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium mb-1">
                Sıklık
              </label>
              <Select
                value={recurrence.frequency}
                onValueChange={(value) => setRecurrence({
                  ...recurrence,
                  frequency: value as TaskRecurrence["frequency"]
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sıklık seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="monthly">Aylık</SelectItem>
                  <SelectItem value="yearly">Yıllık</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="interval" className="block text-sm font-medium mb-1">
                Aralık
              </label>
              <Input
                id="interval"
                type="number"
                min={1}
                value={recurrence.interval}
                onChange={(e) => setRecurrence({
                  ...recurrence,
                  interval: parseInt(e.target.value)
                })}
                className="w-24"
              />
            </div>

            {recurrence.frequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Günler
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
                    <Button
                      key={day}
                      type="button"
                      variant={recurrence.days?.includes(index + 1) ? "default" : "outline"}
                      className="w-12"
                      onClick={() => {
                        const days = recurrence.days || [];
                        const dayNumber = index + 1;
                        setRecurrence({
                          ...recurrence,
                          days: days.includes(dayNumber)
                            ? days.filter(d => d !== dayNumber)
                            : [...days, dayNumber].sort()
                        });
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                Bitiş Tarihi (Opsiyonel)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !recurrence.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {recurrence.endDate 
                      ? format(new Date(recurrence.endDate), "PPP", { locale: tr }) 
                      : "Tarih seçin"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={recurrence.endDate ? new Date(recurrence.endDate) : undefined}
                    onSelect={(date) => setRecurrence({
                      ...recurrence,
                      endDate: date?.toISOString()
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium mb-1">
                Tekrar Sayısı (Opsiyonel)
              </label>
              <Input
                id="count"
                type="number"
                min={1}
                value={recurrence.count || ""}
                onChange={(e) => setRecurrence({
                  ...recurrence,
                  count: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="w-24"
                placeholder="∞"
              />
            </div>
          </div>
        )}
      </div>

      {(validationError || error) && (
        <Alert variant="destructive">
          <AlertDescription>
            {validationError || error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-2 mt-6">
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
          disabled={isLoading || !title.trim()}
          className="min-w-[100px]"
        >
          {isLoading ? "Kaydediliyor..." : task?.id ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
} 