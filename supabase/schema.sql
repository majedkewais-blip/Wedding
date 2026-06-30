-- ============================================================
-- Mazen & Nourhan — Wedding RSVP schema
-- Run this in Supabase -> SQL Editor (one time).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id                 uuid primary key default gen_random_uuid(),
  invitee_name       text not null,
  phone              text,
  email              text,
  additional_guests  jsonb not null default '[]'::jsonb,
  -- automatically computed head count: the invitee + their additional guests
  guest_count        int generated always as
                     (1 + coalesce(jsonb_array_length(additional_guests), 0)) stored,
  note               text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);

-- keep updated_at fresh on edits
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists rsvps_touch on public.rsvps;
create trigger rsvps_touch before update on public.rsvps
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Row Level Security
--   * The public RSVP form inserts via a server route that uses the
--     SERVICE ROLE key, which bypasses RLS — so we do NOT expose any
--     anon policy. The guest list is therefore unreadable to the public.
--   * Only authenticated users (your admin login) can read / edit / delete.
-- ============================================================
alter table public.rsvps enable row level security;

drop policy if exists "admin full access" on public.rsvps;
create policy "admin full access" on public.rsvps
  for all to authenticated using (true) with check (true);
