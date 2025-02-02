import { Calendar, ListTodo, Star, AlertCircle } from "lucide-react";

export const SMART_LISTS = [
  {
    id: 'today',
    name: 'Bugün',
    icon: Calendar,
    color: 'text-blue-500'
  },
  {
    id: 'starred',
    name: 'Yıldızlı',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    id: 'all',
    name: 'Tüm Görevler',
    icon: ListTodo,
    color: 'text-slate-500'
  },
  {
    id: 'overdue',
    name: 'Geciken',
    icon: AlertCircle,
    color: 'text-red-500'
  }
] as const; 