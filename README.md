# Sarita Handa – Luxury Product Portfolio & Admin Management Portal

A premium, modern luxury product portfolio website and full administrative management system for **Sarita Handa** (inspired by [saritahanda.com](https://saritahanda.com/)), celebrating over 30 years of master Indian needlecraft, heritage textiles, European washed flax linens, and handcrafted teak furniture.

---

## 🏛️ Brand Essence & Visual Language

- **Editorial Luxury Aesthetic**: Warm alabaster (`#FAF8F5`), raw oat & sand (`#E8DED0`), terracotta clay (`#A2644B`), antique sage (`#5E6B5D`), and antique brass accents (`#C5A880`) paired with deep charcoal (`#1C1917`).
- **Refined Typography**: Editorial serif headings (`Cormorant Garamond`), crisp tracked navigation labels, and clean modern body typography (`Plus Jakarta Sans`).
- **High-Resolution Photography**: Diverse, realistic photography across all product categories without generic placeholders.

---

## 🛡️ Admin Dashboard (`/admin`)

The private management portal is accessible at **`/admin`** (or via the discreet "Portal Access" link in the footer).

### 1. Secure Authentication
- **Supabase Auth Integration**: Email and password authentication with encrypted sessions.
- **Protected Routes**: Public visitors cannot access dashboard sections or register themselves.
- **First Time Admin Setup**: Create an authorized user in your Supabase Dashboard under **Authentication -> Users -> Add User** (e.g. `suhaib.ishrat36@gmail.com`).

### 2. Dashboard Overview
- Real-time statistics from Supabase:
  - **Total Products** (Published vs. Draft count)
  - **Total Categories** & **Total Collections**
  - **Total Enquiries** & **New Unprocessed Leads**
- Quick Actions to add products or view customer enquiries.
- Recent activity tables for products and leads.

### 3. Product Management (Full CRUD)
- **Add & Edit Products**: Name, slug, SKU, category, collection, materials, colors, dimensions, craftsmanship technique, care guidelines, and pricing.
- **Supabase Storage Image Management**: Multiple image upload with thumbnail preview, delete, and set cover ordering.
- **Publish / Draft Toggle**: Control visibility on public site with 1 click.
- **Featured Toggle**: Highlight icons on homepage.
- **Delete Safeguards**: Confirmation modal before permanently deleting.

### 4. Category & Collection Management
- Add, edit, and toggle active status for categories.
- Curate lookbook collections with season titles, poetic quotes, and banner imagery.
- Automatically updates public website navigation and filter pills in real time.

### 5. Client Enquiry Management
- View every customer submission from the public portfolio in real time.
- Status workflow: **New**, **Contacted**, **In Progress**, **Completed**.
- Instant mailto / tel links to reply to customers immediately.
- Filter, search, and manage customer notes.

---

## ✨ Public Portfolio Features

### 1. Editorial Homepage
- Full-width hero carousel with seasonal looks (*The Autumn Atelier*, *Heritage Suzani*, *Artisanal Teak*).
- Brand heritage pillars, popular categories grid, featured creations, and *"Living with Sarita Handa"* lifestyle section.
- Needlework philosophy (*French Knot*, *Kashmiri Aari Hook*, *Kantha Running Stitch*, *Suzani Medallions*).

### 2. Dynamic Product Catalogue
- 9 Core Categories: Cushions, Bed Linen, Quilts, Duvet Covers, Table Linen, Drapes, Furniture, Home Accessories, Kids' Collection.
- Instant frontend filters (Category, Collection, Colour, Material), search, and sorting.
- Real-time database integration with automatic fallback to local seed data.

### 3. Individual Product Pages
- High-res galleries, dimensions, materials, care guides, and related creations.
- One-click **"Enquire About This Product"** button auto-populating the form.

### 4. Curated Shortlist / Personal Lookbook
- Bookmark favorite pieces into a slide-out drawer.
- Single-click consolidated inquiry for all shortlisted items.

---

## ⚙️ Supabase Database Schema

The database schema is located at **`supabase/schema.sql`** and **`supabase/admin_dashboard_schema.sql`**.

Run it in your **Supabase Dashboard -> SQL Editor -> New Query -> Run**:
- Creates `products`, `categories`, `collections`, `enquiries`, `admin_users` tables.
- Sets up Row Level Security (RLS) policies.
- Creates `product-images` storage bucket with public read and authenticated write permissions.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (Vercel-ready with vercel.json rewrite)
npm run build
```
