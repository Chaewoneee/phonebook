'use server';

import { supabaseServer } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

export async function addCategory(name: string) {
  const { data, error } = await supabaseServer
    .from('categories')
    .insert([{ name }])
    .select();

  if (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data };
}

export async function updateCategory(id: string, name: string) {
  const { data, error } = await supabaseServer
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data };
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseServer
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
