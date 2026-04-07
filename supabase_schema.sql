-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Create contacts table
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null, -- Encrypted AES-256-GCM
  phone text not null, -- Encrypted AES-256-GCM
  category_id uuid references categories(id) on delete set null,
  memo text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS Policies (For demo, we'll allow public access but structure it for auth)
-- In a real app, users would own their contacts.
alter table categories enable row level security;
alter table contacts enable row level security;

-- Public read access (can be restricted later)
create policy "Allow public view categories" on categories for select using (true);
create policy "Allow public insert categories" on categories for insert with check (true);
create policy "Allow public update categories" on categories for update using (true);
create policy "Allow public delete categories" on categories for delete using (true);

create policy "Allow public view contacts" on contacts for select using (true);
create policy "Allow public insert contacts" on contacts for insert with check (true);
create policy "Allow public update contacts" on contacts for update using (true);
create policy "Allow public delete contacts" on contacts for delete using (true);

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
