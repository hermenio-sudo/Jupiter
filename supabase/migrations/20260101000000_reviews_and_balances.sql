-- ─────────────────────────────────────────────
-- Table: balances
-- One row per user. Holds the current USD balance
-- and the total already withdrawn.
-- ─────────────────────────────────────────────
create table if not exists public.balances (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  amount      numeric(10, 2) not null default 0,
  withdrawn   numeric(10, 2) not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.balances enable row level security;

-- Users can only see and change their own balance
create policy "balances: select own"
  on public.balances for select
  using (auth.uid() = user_id);

create policy "balances: insert own"
  on public.balances for insert
  with check (auth.uid() = user_id);

create policy "balances: update own"
  on public.balances for update
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- Table: reviews
-- One row per (user, project). Prevents double-dipping.
-- ─────────────────────────────────────────────
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  project_id   text not null,
  score        smallint not null check (score between 1 and 10),
  justification text not null,
  reward       numeric(10, 2) not null,
  created_at   timestamptz not null default now(),
  unique (user_id, project_id)
);

alter table public.reviews enable row level security;

create policy "reviews: select own"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "reviews: insert own"
  on public.reviews for insert
  with check (auth.uid() = user_id);
