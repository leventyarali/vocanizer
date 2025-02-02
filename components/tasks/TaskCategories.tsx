"use client";

import { TaskCategory, TaskList } from "@/lib/types/task";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ListTodo, Star, Calendar, AlertCircle, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryDialog } from "./CategoryDialog";
import { ListDialog } from "./ListDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskCategories } from "@/hooks/tasks/useTaskCategories";
import { SMART_LISTS } from "@/lib/constants/tasks";
import { toast } from "sonner";

interface TaskCategoriesProps {
  categories?: TaskCategory[];
  lists?: TaskList[];
  selectedListId?: string;
  onListSelect?: (listId: string) => void;
  isLoading?: boolean;
}

export function TaskCategories({
  categories = [],
  lists = [],
  selectedListId,
  onListSelect,
  isLoading = false
}: TaskCategoriesProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | undefined>();
  const [selectedList, setSelectedList] = useState<TaskList | undefined>();
  const [selectedCategoryForList, setSelectedCategoryForList] = useState<string | undefined>();

  const { deleteCategory, deleteList } = useTaskCategories();

  // Hydration için client-side state'i güncelle
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    categories.forEach(category => {
      initialExpandedState[category.id] = false;
    });
    setExpandedCategories(initialExpandedState);
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEditCategory = (category: TaskCategory) => {
    setSelectedCategory(category);
    setIsNewCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
        return;
      }
      await deleteCategory(categoryId);
      toast.success("Kategori başarıyla silindi");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Kategori silinirken bir hata oluştu");
    }
  };

  const handleEditList = (list: TaskList) => {
    setSelectedList(list);
    setIsNewListDialogOpen(true);
  };

  const handleDeleteList = async (listId: string) => {
    try {
      if (!confirm("Bu listeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
        return;
      }
      await deleteList(listId);
      toast.success("Liste başarıyla silindi");
    } catch (error) {
      console.error('Error deleting list:', error);
      toast.error("Liste silinirken bir hata oluştu");
    }
  };

  const handleAddList = (categoryId: string) => {
    setSelectedCategoryForList(categoryId);
    setSelectedList(undefined);
    setIsNewListDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-1">
          {SMART_LISTS.map(list => {
            const Icon = list.icon;
            return (
              <Button
                key={list.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  selectedListId === list.id && "bg-slate-100"
                )}
                onClick={() => onListSelect?.(list.id)}
              >
                <Icon className={cn("h-4 w-4 mr-2", list.color)} />
                {list.name}
              </Button>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Kategoriler</h2>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-slate-100"
              onClick={() => {
                setSelectedCategory(undefined);
                setIsNewCategoryDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {categories.map(category => {
            const categoryLists = lists.filter(l => l.category_id === category.id);
            const isExpanded = expandedCategories[category.id];

            return (
              <div key={category.id} className="group">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleAddList(category.id)}
                        className="text-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Liste Ekle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {isExpanded && (
                  <div className="ml-4 space-y-1 mt-1">
                    {categoryLists.map(list => (
                      <div key={list.id} className="flex items-center group/list">
                        <Button
                          variant="ghost"
                          className={cn(
                            "flex-1 justify-start pl-8",
                            selectedListId === list.id && "bg-slate-100"
                          )}
                          onClick={() => onListSelect?.(list.id)}
                        >
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: list.color }}
                          />
                          {list.name}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="opacity-0 group-hover/list:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditList(list)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteList(list.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CategoryDialog
        open={isNewCategoryDialogOpen}
        onOpenChange={setIsNewCategoryDialogOpen}
        category={selectedCategory}
      />

      <ListDialog
        open={isNewListDialogOpen}
        onOpenChange={setIsNewListDialogOpen}
        list={selectedList}
        categoryId={selectedCategoryForList}
      />
    </>
  );
} 