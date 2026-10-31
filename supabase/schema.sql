-- ==============================================================================
-- Sarita Handa Luxury Portfolio - Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create Enquiries Table
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  product_name text,
  category text,
  enquiry_type text default 'Product Availability & Bespoke Enquiry',
  message text not null,
  shortlist jsonb,
  status text default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.enquiries enable row level security;

-- 3. Policy: Allow visitors to insert new enquiries from the website
create policy "Allow anonymous enquiry submissions"
  on public.enquiries
  for insert
  with check (true);

-- 4. Policy: Allow authenticated project members / admins to view and manage enquiries
create policy "Allow authenticated users to view enquiries"
  on public.enquiries
  for select
  to authenticated
  using (true);

create policy "Allow authenticated users to update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (true);

-- 5. Create index for fast sorting by date
create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);
create index if not exists idx_enquiries_status on public.enquiries (status);

-- Optional: Newsletter Subscribers Table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.newsletter_subscribers enable row level security;

create policy "Allow anonymous newsletter signup"
  on public.newsletter_subscribers
  for insert
  with check (true);
