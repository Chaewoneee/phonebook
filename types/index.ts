export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  memo: string | null;
  category_id: string | null;
  user_id: string;
  created_at: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  category_id?: string;
  memo?: string;
}
