'use server';

import { supabaseAdmin } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Category, ActionResponse } from '@/types';

async function getUserIdFromToken(token?: string): Promise<string | null> {
  if (!token) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    console.error('Auth error:', error?.message);
    return null;
  }
  return user.id;
}

export async function getCategories(token: string): Promise<Category[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return [];

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function addCategory(token: string, name: string): Promise<ActionResponse<Category[]>> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return { success: false, error: 'User not authenticated' };

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert([{ name, user_id: userId }])
    .select();

  if (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data: data || [] };
}

export async function updateCategory(token: string, id: string, name: string): Promise<ActionResponse<Category[]>> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return { success: false, error: 'User not authenticated' };

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ name })
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data: data || [] };
}

export async function deleteCategory(token: string, id: string): Promise<ActionResponse> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return { success: false, error: 'User not authenticated' };

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
