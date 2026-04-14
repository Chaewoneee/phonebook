'use server';

import { supabaseAdmin } from '@/utils/supabase/server';
import { encrypt, decrypt } from '@/utils/crypto';
import { revalidatePath } from 'next/cache';
import { Contact, ActionResponse, ContactFormData } from '@/types';

async function getUserIdFromToken(token?: string): Promise<string | null> {
  if (!token) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    console.error('Auth error:', error?.message);
    return null;
  }
  return user.id;
}

export async function getContacts(token: string, categoryId?: string): Promise<Contact[]> {
  const userId = await getUserIdFromToken(token);
  if (!userId) {
    console.warn('Unauthorized attempt to fetch contacts');
    return [];
  }

  let query = supabaseAdmin
    .from('contacts')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  if (!data) return [];

  // Decrypt name and phone for each contact
  return data.map((contact: any) => ({
    ...contact,
    name: decrypt(contact.name),
    phone: decrypt(contact.phone),
  }));
}

export async function addContact(token: string, formData: ContactFormData): Promise<ActionResponse<Contact[]>> {
  try {
    const userId = await getUserIdFromToken(token);
    if (!userId) return { success: false, error: 'User not authenticated' };

    const { name, phone, category_id, memo } = formData;

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert([
        {
          user_id: userId,
          name: encrypt(name),
          phone: encrypt(phone),
          category_id: category_id || null,
          memo: memo || '',
        },
      ])
      .select();

    if (error) {
      console.error('Error adding contact:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error adding contact:', error.message);
    return { success: false, error: error.message || '암호화 또는 통신 중 오류가 발생했습니다.' };
  }
}

export async function updateContact(token: string, id: string, formData: ContactFormData): Promise<ActionResponse<Contact[]>> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return { success: false, error: 'User not authenticated' };

  const { name, phone, category_id, memo } = formData;

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .update({
      name: encrypt(name),
      phone: encrypt(phone),
      category_id: category_id || null,
      memo: memo || '',
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating contact:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data: data || [] };
}

export async function deleteContact(token: string, id: string): Promise<ActionResponse> {
  const userId = await getUserIdFromToken(token);
  if (!userId) return { success: false, error: 'User not authenticated' };

  const { error } = await supabaseAdmin
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting contact:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
