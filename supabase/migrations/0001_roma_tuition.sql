create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin', 'parent');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.review_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.first_name_only(source text)
returns text
language sql
immutable
as $$
  select coalesce(nullif(split_part(trim(source), ' ', 1), ''), 'Parent');
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.app_role not null,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
      and active = true
  );
$$;

create or replace function public.is_active_parent()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'parent'
      and active = true
  );
$$;

create table if not exists public.parent_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  active boolean not null default true,
  last_invited_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  gallery_enabled boolean not null default false,
  phone text not null,
  whatsapp text,
  address text,
  hours text,
  updated_by uuid references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  hero_title_en text not null,
  hero_title_hi text not null,
  hero_subtitle_en text not null,
  hero_subtitle_hi text not null,
  hero_primary_cta_label_en text not null,
  hero_primary_cta_label_hi text not null,
  hero_secondary_cta_label_en text not null,
  hero_secondary_cta_label_hi text not null,
  about_intro_en text not null,
  about_intro_hi text not null,
  teaching_style_en text not null,
  teaching_style_hi text not null,
  contact_heading_en text not null,
  contact_heading_hi text not null,
  contact_text_en text not null,
  contact_text_hi text not null,
  gallery_teaser_title_en text not null,
  gallery_teaser_title_hi text not null,
  gallery_teaser_text_en text not null,
  gallery_teaser_text_hi text not null,
  updated_by uuid references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.offerings (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_hi text not null,
  details_en text not null,
  details_hi text not null,
  schedule_en text not null,
  schedule_hi text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.why_choose_items (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_hi text not null,
  description_en text not null,
  description_hi text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  public_display_name text not null,
  review_text text not null,
  locale text not null check (locale in ('en', 'hi')),
  status public.review_status not null default 'pending',
  submitted_at timestamptz not null default timezone('utc', now()),
  approved_at timestamptz,
  approved_by uuid references public.profiles(user_id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  caption_en text,
  caption_hi text,
  alt_text_en text,
  alt_text_hi text,
  display_date date,
  sort_order integer not null default 0,
  active boolean not null default true,
  uploaded_at timestamptz not null default timezone('utc', now()),
  uploaded_by uuid references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.sync_review_display_name()
returns trigger
language plpgsql
as $$
begin
  new.parent_name = trim(new.parent_name);
  new.review_text = trim(new.review_text);
  new.public_display_name = public.first_name_only(new.parent_name);
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists parent_invites_set_updated_at on public.parent_invites;
create trigger parent_invites_set_updated_at
before update on public.parent_invites
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists offerings_set_updated_at on public.offerings;
create trigger offerings_set_updated_at
before update on public.offerings
for each row execute function public.set_updated_at();

drop trigger if exists why_choose_items_set_updated_at on public.why_choose_items;
create trigger why_choose_items_set_updated_at
before update on public.why_choose_items
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists reviews_sync_display_name on public.reviews;
create trigger reviews_sync_display_name
before insert or update on public.reviews
for each row execute function public.sync_review_display_name();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.parent_invites enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.offerings enable row level security;
alter table public.why_choose_items enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "profiles self or admin select" on public.profiles;
create policy "profiles self or admin select"
on public.profiles for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles self or admin update" on public.profiles;
create policy "profiles self or admin update"
on public.profiles for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "parent invites admin all" on public.parent_invites;
create policy "parent invites admin all"
on public.parent_invites for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "site settings public read" on public.site_settings;
create policy "site settings public read"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "site settings admin mutate" on public.site_settings;
create policy "site settings admin mutate"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "site content public read" on public.site_content;
create policy "site content public read"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "site content admin mutate" on public.site_content;
create policy "site content admin mutate"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "offerings public read active" on public.offerings;
create policy "offerings public read active"
on public.offerings for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "offerings admin mutate" on public.offerings;
create policy "offerings admin mutate"
on public.offerings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "why choose public read active" on public.why_choose_items;
create policy "why choose public read active"
on public.why_choose_items for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "why choose admin mutate" on public.why_choose_items;
create policy "why choose admin mutate"
on public.why_choose_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reviews public read approved" on public.reviews;
create policy "reviews public read approved"
on public.reviews for select
to anon, authenticated
using (status = 'approved' or public.is_admin());

drop policy if exists "reviews public insert pending" on public.reviews;
create policy "reviews public insert pending"
on public.reviews for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "reviews admin mutate" on public.reviews;
create policy "reviews admin mutate"
on public.reviews for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "gallery admin parent read" on public.gallery_items;
create policy "gallery admin parent read"
on public.gallery_items for select
to authenticated
using (public.is_admin() or public.is_active_parent());

drop policy if exists "gallery admin mutate" on public.gallery_items;
create policy "gallery admin mutate"
on public.gallery_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', false)
on conflict (id) do nothing;

drop policy if exists "gallery objects admin read write" on storage.objects;
create policy "gallery objects admin read write"
on storage.objects for all
to authenticated
using (bucket_id = 'gallery' and public.is_admin())
with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "gallery objects parent read" on storage.objects;
create policy "gallery objects parent read"
on storage.objects for select
to authenticated
using (bucket_id = 'gallery' and (public.is_admin() or public.is_active_parent()));
