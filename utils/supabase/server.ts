import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createClientServer() {
  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        // You might need to manually extract the session cookie if not using @supabase/ssr
        // But for simplicity in this environment, we'll try to use the dev key first
        // or expect the middleware to handle session refreshing.
      }
    },
    auth: {
      persistSession: false, // Don't persist on server
    }
  });
}

// Keep the old one for non-cookie contexts if needed, but rename it
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);
