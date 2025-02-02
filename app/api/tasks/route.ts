import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addDays, addMonths, addWeeks, addYears, startOfDay } from "date-fns";
import { Task, TaskRecurrence } from "@/lib/types/task";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"; // Sabit UUID

type TaskWithParent = Task & {
  parent_task_id?: string;
};

function generateRecurringTasks(task: Task, recurrence: TaskRecurrence) {
  const tasks: Omit<TaskWithParent, 'id'>[] = [];
  const startDate = task.due_date ? new Date(task.due_date) : new Date();
  let currentDate = startDate;
  let count = 0;

  while (true) {
    // Tekrar sayısı kontrolü
    if (recurrence.count && count >= recurrence.count) break;

    // Bitiş tarihi kontrolü
    if (recurrence.endDate && currentDate > new Date(recurrence.endDate)) break;

    // Haftalık tekrar için gün kontrolü
    if (recurrence.frequency === "weekly" && recurrence.days) {
      const currentDay = currentDate.getDay() || 7; // 0 = Pazar, 1-6 = Pazartesi-Cumartesi
      if (!recurrence.days.includes(currentDay)) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
    }

    tasks.push({
      ...task,
      due_date: currentDate.toISOString(),
      parent_task_id: task.id,
      order_index: count
    });

    count++;

    // Bir sonraki tarihe geç
    switch (recurrence.frequency) {
      case "daily":
        currentDate = addDays(currentDate, recurrence.interval);
        break;
      case "weekly":
        if (recurrence.days) {
          currentDate = addDays(currentDate, 1);
        } else {
          currentDate = addWeeks(currentDate, recurrence.interval);
        }
        break;
      case "monthly":
        currentDate = addMonths(currentDate, recurrence.interval);
        break;
      case "yearly":
        currentDate = addYears(currentDate, recurrence.interval);
        break;
    }
  }

  return tasks;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createClient();
    
    const filters = {
      search: searchParams.get('search'),
      priority: searchParams.get('priority'),
      status: searchParams.get('status'),
      list_id: searchParams.get('list_id'),
      category_id: searchParams.get('category_id'),
      is_starred: searchParams.get('is_starred'),
      due_date: searchParams.get('due_date')
    };

    let query = supabase
      .from('tasks')
      .select(`
        *,
        subtasks (*),
        attachments (*)
      `)
      .eq('user_id', DEFAULT_USER_ID)
      .is('parent_task_id', null) // Sadece ana görevleri getir
      .order('order_index');

    // Apply filters
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.status === 'completed') {
      query = query.eq('is_completed', true);
    } else if (filters.status === 'active') {
      query = query.eq('is_completed', false);
    }

    if (filters.list_id) {
      query = query.eq('list_id', filters.list_id);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.is_starred === 'true') {
      query = query.eq('is_starred', true);
    }

    if (filters.due_date === 'today') {
      const today = startOfDay(new Date());
      const tomorrow = addDays(today, 1);
      
      query = query.gte('due_date', today.toISOString())
        .lt('due_date', tomorrow.toISOString());
    } else if (filters.due_date === 'overdue') {
      const today = startOfDay(new Date());
      query = query.lt('due_date', today.toISOString())
        .eq('is_completed', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { recurrence, ...taskData } = body;

    // Son görevin sıra numarasını al
    const { data: lastTask } = await supabase
      .from('tasks')
      .select('order_index')
      .eq('list_id', body.list_id)
      .eq('user_id', DEFAULT_USER_ID)
      .is('parent_task_id', null)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newTask = {
      ...taskData,
      user_id: DEFAULT_USER_ID,
      order_index: lastTask ? lastTask.order_index + 1 : 0,
      is_completed: false,
      is_starred: false
    };

    // Ana görevi oluştur
    const { data: mainTask, error: mainTaskError } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (mainTaskError) throw mainTaskError;

    // Tekrarlanan görevleri oluştur
    if (recurrence && mainTask.due_date) {
      const recurringTasks = generateRecurringTasks(mainTask, recurrence);
      
      if (recurringTasks.length > 0) {
        const { error: recurringError } = await supabase
          .from('tasks')
          .insert(recurringTasks);

        if (recurringError) throw recurringError;
      }
    }

    // Güncellenmiş görevi getir
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (*),
        attachments (*)
      `)
      .eq('id', mainTask.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id, recurrence, ...updates } = body;

    // Önce ana görevi güncelle
    const { data: mainTask, error: mainTaskError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID)
      .select()
      .single();

    if (mainTaskError) throw mainTaskError;

    // Tekrarlanan görevleri güncelle
    if (recurrence && mainTask.due_date) {
      // Eski tekrarlanan görevleri sil
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('parent_task_id', id);

      if (deleteError) throw deleteError;

      // Yeni tekrarlanan görevleri oluştur
      const recurringTasks = generateRecurringTasks(mainTask, recurrence);
      
      if (recurringTasks.length > 0) {
        const { error: recurringError } = await supabase
          .from('tasks')
          .insert(recurringTasks);

        if (recurringError) throw recurringError;
      }
    }

    return NextResponse.json(mainTask);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 