-- À exécuter dans l'éditeur SQL de Supabase
create extension if not exists pgcrypto;

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  plate text not null,
  brand text,
  model text,
  client_name text,
  phone text,
  mileage integer,
  insurance text,
  claim_number text,
  entry_date date,
  exit_date date,
  status text not null default 'En attente',
  created_at timestamptz not null default now()
);
create index if not exists vehicles_plate_idx on vehicles (upper(plate));

create table if not exists repair_tasks (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  zone text not null,
  work text not null,
  priority text default 'Moyenne',
  status text not null default 'À faire',
  created_at timestamptz not null default now()
);

create table if not exists vehicle_conditions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  zone text not null,
  observation text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table vehicles enable row level security;
alter table repair_tasks enable row level security;
alter table vehicle_conditions enable row level security;

create policy "authenticated vehicles" on vehicles for all to authenticated using (true) with check (true);
create policy "authenticated repair_tasks" on repair_tasks for all to authenticated using (true) with check (true);
create policy "authenticated vehicle_conditions" on vehicle_conditions for all to authenticated using (true) with check (true);
