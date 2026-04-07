'use server';

import { supabaseServer } from '@/utils/supabase/server';
import { encrypt, decrypt } from '@/utils/crypto';
import { revalidatePath } from 'next/cache';

export async function getContacts(categoryId?: string) {
  let query = supabaseServer
    .from('contacts')
    .select(`
      *,
      category:categories(id, name)
    `)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  // Decrypt name and phone for each contact
  return data.map(contact => ({
    ...contact,
    name: decrypt(contact.name),
    phone: decrypt(contact.phone),
  }));
}

export async function addContact(formData: {
  name: string;
  phone: string;
  category_id?: string;
  memo?: string;
}) {
  try {
    const { name, phone, category_id, memo } = formData;

    const { data, error } = await supabaseServer
      .from('contacts')
      .insert([
        {
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
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding contact:', error.message);
    return { success: false, error: error.message || '암호화 또는 통신 중 오류가 발생했습니다.' };
  }
}

export async function updateContact(id: string, formData: {
  name: string;
  phone: string;
  category_id?: string;
  memo?: string;
}) {
  const { name, phone, category_id, memo } = formData;

  const { data, error } = await supabaseServer
    .from('contacts')
    .update({
      name: encrypt(name),
      phone: encrypt(phone),
      category_id: category_id || null,
      memo: memo || '',
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating contact:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data };
}

export async function deleteContact(id: string) {
  const { error } = await supabaseServer
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
