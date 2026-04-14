'use server';

import { supabaseAdmin } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ActionResponse } from '@/types';

export async function signUp(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Create user using Admin API to bypass email confirmation
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // After creating user, sign them in to initiate session
  const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { success: false, error: signInError.message };
  }

  return { success: true };
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut(): Promise<ActionResponse> {
  const { error } = await supabaseAdmin.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath('/', 'layout');
  redirect('/login');
}
