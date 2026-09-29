-- Mis Finanzas: esquema de base de datos + seguridad por usuario
-- Pegar completo en Supabase > SQL Editor > New query > Run

create extension if not exists "pgcrypto";

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  type text not null check (type in ('income','expense')),
  category text not null,
  amount numeric not null check (amount > 0),
  note text default '',
  date date not null,
  created_at timestamptz not null default now()
);

create table public.budgets (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  category_id text not null,
  limit_amount numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, category_id)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  kind text not null check (kind in ('saving','debt')),
  target numeric not null check (target > 0),
  current numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;

create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own budgets" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
