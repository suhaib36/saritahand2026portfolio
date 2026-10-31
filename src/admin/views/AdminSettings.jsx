import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { supabaseUrl, isSupabaseConfigured } from '../../lib/supabase';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminSeedInitialDatabase } from '../../services/catalogService';

export default function AdminSettings() {
  const { user } = useAdminAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSeedDatabase = async () => {
    if (!window.confirm('Populate Supabase with the complete Sarita Handa catalog (16 products, 9 categories, 6 collections)? Existing items with matching slugs will be safely updated.')) {
      return;
    }

    setIsSeeding(true);
    setSeedResult(null);

    try {
      const report = await adminSeedInitialDatabase();
      setSeedResult({
        success: true,
        report,
      });
    } catch (err) {
      setSeedResult({
        success: false,
        error: err.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySchemaSql = () => {
    const sqlScript = `-- Sarita Handa Schema Setup
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

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  customer_phone text,
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

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;

create policy "Public read active categories" on public.categories for select using (is_active = true or auth.role() = 'authenticated');
create policy "Admin manage categories" on public.categories for all to authenticated using (true) with check (true);

create policy "Public read published collections" on public.collections for select using (is_published = true or auth.role() = 'authenticated');
create policy "Admin manage collections" on public.collections for all to authenticated using (true) with check (true);

create policy "Public read published products" on public.products for select using (is_published = true or auth.role() = 'authenticated');
create policy "Admin manage products" on public.products for all to authenticated using (true) with check (true);

create policy "Allow anonymous enquiry submissions" on public.enquiries for insert to anon, authenticated with check (true);
create policy "Admin view enquiries" on public.enquiries for select to authenticated using (true);
create policy "Admin update enquiries" on public.enquiries for update to authenticated using (true) with check (true);
create policy "Admin delete enquiries" on public.enquiries for delete to authenticated using (true);
`;

    navigator.clipboard?.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="pb-4 border-b border-[#E8DED0]">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
          System Diagnostics
        </span>
        <h1 className="font-serif text-3xl text-stone-900 font-normal">
          Dashboard Settings & Configuration
        </h1>
      </div>

      {/* 1. Supabase Connection Status Card */}
      <div className="bg-white p-6 border border-[#E8DED0] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#A2644B]" />
            <h2 className="font-serif text-xl text-stone-900">Supabase Connection</h2>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
              Project Endpoint URL
            </span>
            <code className="bg-[#FAF8F5] p-2 border border-[#E8DED0] block text-stone-800 font-mono text-[11px] truncate">
              {supabaseUrl}
            </code>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
              Active Admin Session
            </span>
            <code className="bg-[#FAF8F5] p-2 border border-[#E8DED0] block text-stone-800 font-mono text-[11px] truncate">
              {user?.email || 'N/A'}
            </code>
          </div>
        </div>
      </div>

      {/* 2. One-Click Catalog Seed Tool */}
      <div className="bg-white p-6 border border-[#E8DED0] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C5A880]" />
            <h2 className="font-serif text-xl text-stone-900">
              One-Click Catalogue Sync & Seeder
            </h2>
          </div>
        </div>

        <p className="text-xs font-sans text-stone-600 leading-relaxed">
          Sync all 16+ signature Sarita Handa products, 9 categories, and 6 lookbook collections directly into your Supabase database tables. Once in Supabase, you can freely edit pricing, replace imagery, create new items, or delete products without touching the website code.
        </p>

        {seedResult && (
          <div
            className={`p-4 text-xs border ${
              seedResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {seedResult.success ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Catalogue Seed Completed Successfully!</span>
                </div>
                <div className="pl-6 space-y-0.5 text-[11px]">
                  <div>• Categories synced: {seedResult.report.categoriesInserted}</div>
                  <div>• Collections synced: {seedResult.report.collectionsInserted}</div>
                  <div>• Products synced: {seedResult.report.productsInserted}</div>
                  {seedResult.report.errors.length > 0 && (
                    <div className="text-amber-700 pt-1">
                      Notes: {seedResult.report.errors.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Seed operation failed: {seedResult.error}</span>
              </div>
            )}
          </div>
        )}

        <div>
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all disabled:opacity-60 shadow-md"
          >
            {isSeeding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing Catalog into Supabase...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span>Seed Database With Initial Catalogue</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Schema Reference & Copy Tool */}
      <div className="bg-white p-6 border border-[#E8DED0] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-xl text-stone-900">Database Schema Reference</h2>
          </div>

          <button
            onClick={handleCopySchemaSql}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-sans uppercase tracking-wider transition-colors"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs font-sans text-stone-600 leading-relaxed">
          The complete database schema script is available at <code className="bg-stone-100 px-1.5 py-0.5 text-stone-800">supabase/admin_dashboard_schema.sql</code>. It includes all tables (<code className="text-stone-800">products</code>, <code className="text-stone-800">categories</code>, <code className="text-stone-800">collections</code>, <code className="text-stone-800">enquiries</code>), indexes, and Row Level Security policies.
        </p>
      </div>
    </div>
  );
}
