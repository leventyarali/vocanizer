import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"; // Sabit UUID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    const supabase = createClient();
    
    let query = supabase
      .from('task_lists')
      .select()
      .eq('user_id', DEFAULT_USER_ID)
      .order('order_index');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
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

    const { data: lastList } = await supabase
      .from('task_lists')
      .select('order_index')
      .eq('category_id', body.category_id)
      .eq('user_id', DEFAULT_USER_ID)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newList = {
      ...body,
      user_id: DEFAULT_USER_ID,
      order_index: lastList ? lastList.order_index + 1 : 0
    };

    const { data, error } = await supabase
      .from('task_lists')
      .insert(newList)
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
    const supabase = createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('task_lists')
      .update(updates)
      .eq('id', id)
      .eq('user_id', DEFAULT_USER_ID)
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
    
    if (!id) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('task_lists')
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