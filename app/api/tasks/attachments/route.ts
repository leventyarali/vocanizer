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

    // Dosya eklerini getir
    const { data, error } = await supabase
      .from('task_attachments')
      .select()
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('task_id') as string;

    if (!file || !taskId) {
      return NextResponse.json(
        { error: 'File and Task ID are required' },
        { status: 400 }
      );
    }

    // Önce görevin kullanıcıya ait olduğunu kontrol et
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !task) throw new Error('Task not found');

    // Dosyayı yükle
    const fileName = `${taskId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('task-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Dosya kaydını oluştur
    const attachment = {
      task_id: taskId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: uploadData.path
    };

    const { data, error } = await supabase
      .from('task_attachments')
      .insert(attachment)
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
        { error: 'Attachment ID and Task ID are required' },
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

    // Dosya bilgisini al
    const { data: attachment, error: attachmentError } = await supabase
      .from('task_attachments')
      .select()
      .eq('id', id)
      .eq('task_id', taskId)
      .single();

    if (attachmentError || !attachment) throw new Error('Attachment not found');

    // Dosyayı storage'dan sil
    const { error: storageError } = await supabase.storage
      .from('task-attachments')
      .remove([attachment.storage_path]);

    if (storageError) throw storageError;

    // Dosya kaydını sil
    const { error } = await supabase
      .from('task_attachments')
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