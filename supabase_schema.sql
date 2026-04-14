-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Create contacts table
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  name text not null, -- Encrypted AES-256-GCM
  phone text not null, -- Encrypted AES-256-GCM
  category_id uuid references categories(id) on delete set null,
  memo text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS Policies
alter table categories enable row level security;
alter table contacts enable row level security;

-- Categories Policies
create policy "Users can view their own categories" on categories for select using (auth.uid() = user_id);
create policy "Users can insert their own categories" on categories for insert with check (auth.uid() = user_id);
create policy "Users can update their own categories" on categories for update using (auth.uid() = user_id);
create policy "Users can delete their own categories" on categories for delete using (auth.uid() = user_id);

-- Contacts Policies
create policy "Users can view their own contacts" on contacts for select using (auth.uid() = user_id);
create policy "Users can insert their own contacts" on contacts for insert with check (auth.uid() = user_id);
create policy "Users can update their own contacts" on contacts for update using (auth.uid() = user_id);
create policy "Users can delete their own contacts" on contacts for delete using (auth.uid() = user_id);

-- Function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on contacts
  for each row
  execute procedure handle_updated_at();
