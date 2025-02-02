"use client";

import { useState, Suspense, lazy, memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskCategories } from "@/components/tasks/TaskCategories";
import { useTaskCategories } from "@/hooks/tasks/useTaskCategories";
import { useTasks } from "@/hooks/tasks/useTasks";
import { Task } from "@/lib/types/task";
import { Skeleton } from "@/components/ui/skeleton";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import { PageHeader } from "@/components/admin/page-header";
import { toast } from "sonner";
import { TaskCard as TaskCardComponent } from "@/components/tasks/TaskCard";

// Lazy load components
const TaskCard = lazy(() => Promise.resolve({ default: TaskCardComponent }));

// Memoize TaskCategories component
const MemoizedTaskCategories = memo(TaskCategories);

export default function TaskListPage() {
  const router = useRouter();
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  const {
    categories,
    lists,
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useTaskCategories();

  const {
    tasks,
    isLoading: isTasksLoading,
    error: tasksError,
    filters,
    applyFilters,
    reorderTasks
  } = useTasks({ list_id: selectedListId || undefined });

  // Hata durumlarını kontrol et
  if (categoriesError) {
    toast.error("Kategoriler yüklenirken bir hata oluştu");
  }

  if (tasksError) {
    toast.error("Görevler yüklenirken bir hata oluştu");
  }

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
  };

  const handleTaskSelect = (taskId: string, selected: boolean) => {
    setSelectedTaskIds(prev => 
      selected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newIndex = result.destination.index;

    handleTaskReorder(taskId, newIndex);
  };

  const handleTaskReorder = async (taskId: string, newIndex: number) => {
    try {
      await reorderTasks(taskId, newIndex);
    } catch (error) {
      console.error('Error reordering tasks:', error);
      toast.error("Görev sırası değiştirilirken bir hata oluştu");
    }
  };

  return (
    <div className="flex h-full">
      {/* Sol Sidebar - Kategoriler */}
      <div className="w-64 border-r bg-slate-50 p-4 hidden md:block">
        <MemoizedTaskCategories 
          categories={categories}
          lists={lists}
          selectedListId={selectedListId || undefined}
          onListSelect={handleListSelect}
          isLoading={isCategoriesLoading}
        />
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col p-6">
        <PageHeader
          title="Görevler"
          description={selectedTaskIds.length > 0 ? `${selectedTaskIds.length} görev seçildi` : undefined}
        >
          {selectedTaskIds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedTaskIds([])}
            >
              Seçimi Temizle
            </Button>
          )}
          <Button 
            onClick={() => router.push("/admin/tasks/create")}
            disabled={!selectedListId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Görev
          </Button>
        </PageHeader>

        <div className="mt-6">
          <TaskFilters 
            onFilterChange={applyFilters}
            filters={filters}
          />
          
          {isTasksLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided: DroppableProvided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided: DraggableProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="transition-all duration-200 hover:scale-[1.01]"
                          >
                            <TaskCardComponent
                              task={task}
                              isSelected={selectedTaskIds.includes(task.id)}
                              onSelect={handleTaskSelect}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}
