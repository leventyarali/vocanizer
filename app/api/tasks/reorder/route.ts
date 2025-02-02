import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          },
          set(name, value, options) {
            cookieStore.set(name, value, options);
          },
          remove(name, options) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Kullanıcı bilgisini al
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const body = await request.json();
    const { taskId, newIndex, listId } = body;

    // Önce taşınacak görevi al
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    // Listedeki diğer görevleri al
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select()
      .eq('list_id', listId || task.list_id)
      .eq('user_id', user.id)
      .order('order_index');

    if (tasksError) throw tasksError;

    // Görevleri yeniden sırala
    const reorderedTasks = tasks.filter(t => t.id !== taskId);
    reorderedTasks.splice(newIndex, 0, task);

    // Yeni sıra numaralarını güncelle
    const updates = reorderedTasks.map((task, index) => ({
      id: task.id,
      order_index: index
    }));

    // Toplu güncelleme yap
    const { error: updateError } = await supabase
      .from('tasks')
      .upsert(updates);

    if (updateError) throw updateError;

    // Güncellenmiş görev listesini döndür
    const { data: updatedTasks, error: finalError } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (*),
        attachments (*)
      `)
      .eq('list_id', listId || task.list_id)
      .eq('user_id', user.id)
      .order('order_index');

    if (finalError) throw finalError;

    return NextResponse.json(updatedTasks);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 