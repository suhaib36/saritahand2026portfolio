-- ==============================================================================
-- Sarita Handa Luxury Portfolio - Complete Admin & Catalog Schema
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  image text,
  is_active boolean default true not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. COLLECTIONS TABLE
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  year text,
  description text,
  quote text,
  banner_image text,
  is_featured boolean default false,
  is_published boolean default true not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text,
  badge text,
  short_description text,
  description text,
  story text,
  price numeric(10, 2),
  category_id uuid references public.categories(id) on delete set null,
  category_name text,
  collection_id uuid references public.collections(id) on delete set null,
  collection_name text,
  material text,
  colour text,
  colors jsonb default '[]'::jsonb,
  dimensions text,
  technique text,
  care text,
  lead_time text,
  specifications jsonb default '{}'::jsonb,
  images text[] default '{}'::text[],
  is_featured boolean default false,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ENQUIRIES TABLE (Create or alter with full field support)
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  full_name text,
  customer_email text,
  email text,
  customer_phone text,
  phone text,
  product_id text,
  product_name text,
  product_image text,
  category text,
  enquiry_type text default 'Product Availability & Bespoke Enquiry',
  quantity text default '1',
  message text not null,
  shortlist jsonb,
  status text default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'archived')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure newly added columns exist if enquiries table was created previously
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'customer_name') then
    alter table public.enquiries add column customer_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'customer_email') then
    alter table public.enquiries add column customer_email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'customer_phone') then
    alter table public.enquiries add column customer_phone text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'product_id') then
    alter table public.enquiries add column product_id text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'product_image') then
    alter table public.enquiries add column product_image text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'admin_notes') then
    alter table public.enquiries add column admin_notes text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'enquiries' and column_name = 'updated_at') then
    alter table public.enquiries add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
  end if;
end $$;

-- 6. ADMIN USERS TABLE (Explicit role management)
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text default 'admin' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;
alter table public.admin_users enable row level security;

-- 8. RLS POLICIES FOR CATEGORIES
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
  on public.categories for select
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- 9. RLS POLICIES FOR COLLECTIONS
drop policy if exists "Public read published collections" on public.collections;
create policy "Public read published collections"
  on public.collections for select
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Admin manage collections" on public.collections;
create policy "Admin manage collections"
  on public.collections for all
  to authenticated
  using (true)
  with check (true);

-- 10. RLS POLICIES FOR PRODUCTS
drop policy if exists "Public read published products" on public.products;
create policy "Public read published products"
  on public.products for select
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- 11. RLS POLICIES FOR ENQUIRIES
drop policy if exists "Allow anonymous enquiry submissions" on public.enquiries;
create policy "Allow anonymous enquiry submissions"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admin view enquiries" on public.enquiries;
create policy "Admin view enquiries"
  on public.enquiries for select
  to authenticated
  using (true);

drop policy if exists "Admin update enquiries" on public.enquiries;
create policy "Admin update enquiries"
  on public.enquiries for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin delete enquiries" on public.enquiries;
create policy "Admin delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (true);

-- 12. RLS POLICIES FOR ADMIN USERS
drop policy if exists "Admin read profiles" on public.admin_users;
create policy "Admin read profiles"
  on public.admin_users for select
  to authenticated
  using (true);

-- 13. INDEXES FOR PERFORMANCE
create index if not exists idx_products_published on public.products (is_published);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_collection on public.products (collection_id);
create index if not exists idx_products_featured on public.products (is_featured);
create index if not exists idx_categories_active on public.categories (is_active);
create index if not exists idx_collections_published on public.collections (is_published);
create index if not exists idx_enquiries_status on public.enquiries (status);
create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);

-- 14. SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage RLS: Public read, authenticated manage
drop policy if exists "Public Access for product images" on storage.objects;
create policy "Public Access for product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
