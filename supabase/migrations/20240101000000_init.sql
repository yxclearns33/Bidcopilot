-- Enable RLS (Row Level Security) on all tables
-- This means users can only see their own data

-- Company profiles
create table if not exists company_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  company_name text,
  industry text,
  location text,
  staff_count text,
  operating_region text,
  contract_target_range text,
  services jsonb default '[]',
  compliance jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table company_profiles enable row level security;

create policy "Users can view own profile"
  on company_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on company_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on company_profiles for update
  using (auth.uid() = user_id);

-- Experience (past contracts)
create table if not exists experience (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_name text,
  sector text,
  contract_value text,
  duration text,
  description text,
  outcome text default 'completed',
  created_at timestamp with time zone default now()
);

alter table experience enable row level security;

create policy "Users can manage own experience"
  on experience for all
  using (auth.uid() = user_id);

-- References
create table if not exists references_list (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  company text,
  contact text,
  created_at timestamp with time zone default now()
);

alter table references_list enable row level security;

create policy "Users can manage own references"
  on references_list for all
  using (auth.uid() = user_id);

-- Pipeline
create table if not exists pipeline (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id text not null,
  stage text default 'saved',
  saved_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

alter table pipeline enable row level security;

create policy "Users can manage own pipeline"
  on pipeline for all
  using (auth.uid() = user_id);

-- Bids (saved bid section content)
create table if not exists bids (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id text not null,
  sections jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, opportunity_id)
);

alter table bids enable row level security;

create policy "Users can manage own bids"
  on bids for all
  using (auth.uid() = user_id);
