import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

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

    // Önce görevin kullanıcıya ait olduğunu kontrol et
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    // Alt görevleri getir
    const { data, error } = await supabase
      .from('task_subtasks')
      .select()
      .eq('task_id', taskId)
      .order('order_index');

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
    const { task_id, ...subtaskData } = body;

    // Önce görevin kullanıcıya ait olduğunu kontrol et
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', task_id)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    // Son alt görevin sıra numarasını al
    const { data: lastSubtask } = await supabase
      .from('task_subtasks')
      .select('order_index')
      .eq('task_id', task_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newSubtask = {
      ...subtaskData,
      task_id,
      order_index: lastSubtask ? lastSubtask.order_index + 1 : 0
    };

    const { data, error } = await supabase
      .from('task_subtasks')
      .insert(newSubtask)
      .select()
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
    const { id, task_id, ...updates } = body;

    // Önce görevin kullanıcıya ait olduğunu kontrol et
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', task_id)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    const { data, error } = await supabase
      .from('task_subtasks')
      .update(updates)
      .eq('id', id)
      .eq('task_id', task_id)
      .select()
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const taskId = searchParams.get('task_id');
    
    if (!id || !taskId) {
      return NextResponse.json(
        { error: 'Subtask ID and Task ID are required' },
        { status: 400 }
      );
    }

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

    // Önce görevin kullanıcıya ait olduğunu kontrol et
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    const { error } = await supabase
      .from('task_subtasks')
      .delete()
      .eq('id', id)
      .eq('task_id', taskId);

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