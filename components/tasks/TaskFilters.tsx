"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskPriority } from "@/lib/types/task";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export interface TaskFilters {
  search?: string;
  priority?: TaskPriority;
  status?: 'all' | 'completed' | 'active';
  list_id?: string;
  category_id?: string;
  is_starred?: boolean;
  due_date?: string;
}

interface TaskFiltersProps {
  onFilterChange?: (filters: TaskFilters) => void;
  filters?: TaskFilters;
}

export function TaskFilters({ onFilterChange, filters: initialFilters }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    ...initialFilters
  });
  
  const debouncedSearch = useDebounce(filters.search, 300);
  
  useEffect(() => {
    onFilterChange?.(filters);
  }, [debouncedSearch, filters.priority, filters.status, filters.list_id, filters.category_id, filters.is_starred, filters.due_date]);

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Görev ara..."
          className="pl-9"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={filters.priority}
          onValueChange={(value) => handleFilterChange('priority', value as TaskPriority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Öncelik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="low">Düşük</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="high">Yüksek</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value as 'all' | 'completed' | 'active')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="completed">Tamamlanan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 