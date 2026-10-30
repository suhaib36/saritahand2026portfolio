# Sarita Handa – Luxury Product Portfolio & Design Concierge

A premium, modern luxury product portfolio website for **Sarita Handa** (inspired by [saritahanda.com](https://saritahanda.com/)), celebrating over 30 years of master Indian needlecraft, heritage textiles, European washed flax linens, and handcrafted teak furniture.

---

## 🏛️ Brand Essence & Visual Language

- **Editorial Luxury Aesthetic**: Warm alabaster (`#FAF8F5`), raw oat & sand (`#E8DED0`), terracotta clay (`#A2644B`), antique sage (`#5E6B5D`), and antique brass accents (`#C5A880`) paired with deep charcoal (`#1C1917`).
- **Refined Typography**: Editorial serif headings (`Cormorant Garamond`), crisp tracked navigation labels, and clean modern body typography (`Plus Jakarta Sans`).
- **High-Resolution Photography**: Diverse, realistic photography across all product categories without generic placeholders.

---

## ✨ Key Features

### 1. Editorial Homepage
- **Full-Width Hero Section**: Dynamic showcase with luxury carousel highlighting seasonal collections (*The Autumn Atelier*, *Heritage Suzani Heirlooms*, *Artisanal Teak & Cane*).
- **Brand Introduction & Heritage Pillars**: Honoring craft preservation, pure natural fibres, and bespoke residential concierge.
- **Featured Product Collections**: Visual lookbook cards directing visitors to curated thematic lines.
- **Popular Categories**: Direct visual access to all 9 product categories.
- **Curated Featured Products Grid**: Best-sellers with interactive hover effects, badges, quick view, and enquire shortcuts.
- **"Living with Sarita Handa"**: Editorial magazine vignettes showing styled interior spaces.
- **The Art of the Needle**: Educational section on signature techniques (*The French Knot*, *Kashmiri Aari Hook*, *Kantha Running Stitch*, *Suzani Rosettes*).
- **Bespoke Enquiry Call-to-Action**: High-visibility invitation to collaborate with the design concierge.
- **Premium Footer**: Complete showroom directory, direct concierge contact, and brand manifesto.

### 2. Complete Product Catalogue & Instant Filtering
- **9 Core Categories**:
  1. Cushions (French knot medallions, Aari crewelwork, silk velvet)
  2. Bed Linen (Vintage washed European flax, 500 TC Giza Egyptian cotton)
  3. Quilts (Reversible Suzani heirlooms, hand-block Kantha coverlets)
  4. Duvet Covers (Scalloped border linens, architectural matelassé)
  5. Table Linen (Embroidered runners, scalloped napkin sets)
  6. Drapes (Gossamer linen sheers, heavy blackout velvet curtains)
  7. Furniture (Solid Teak & handwoven cane chairs, fluted Sheesham credenzas)
  8. Home Accessories (Hand-carved alabaster vessels, sand-cast brass candelabras)
  9. Kids' Collection (GOTS-certified organic cotton nursery cushions & cot quilts)
- **Instant Frontend Filtering & Search**:
  - Filter by Category
  - Filter by Collection
  - Filter by Color Palette (with visual swatch dots)
  - Filter by Material (Flax Linen, Cotton, Velvet, Wool, Teak, Stone)
  - Live Search by product name, fabric, or technique
  - Sorting by Featured, Newest, Name (A–Z), Name (Z–A)
  - Active filter badges with one-click individual dismissal & "Clear All"
  - Responsive mobile filter drawer

### 3. Individual Product Detail Pages
- Large image gallery with thumbnail navigation and primary interactive view.
- Category, collection, and SKU identifiers.
- Editorial description and craftsmanship story explaining the heritage and hours of labor.
- Clickable color swatches with active selection.
- Detailed specifications accordion (Dimensions, Material composition, Craftsmanship technique, Care guidelines, Lead times).
- Prominent **"Enquire About This Product"** CTA button (automatically populates the product name into the enquiry form).
- Curated Companions / Related Products grid.

### 4. Direct Email Enquiry System (`suhaib.ishrat36@gmail.com`)
All inquiries from across the website are targeted to:
**`suhaib.ishrat36@gmail.com`**

- **Enquiry Form Fields**:
  - Full Name (required)
  - Email Address (required, validated)
  - Phone Number (for WhatsApp concierge)
  - Product Name (pre-populated automatically)
  - Enquiry Type (Availability, Custom Dimensions, Swatches, Trade / Hospitality, Private Appointment)
  - Message (required)
  - Anti-spam Honeypot protection
- **Integration Options**:
  - **Web3Forms**: Connects to `https://api.web3forms.com/submit` to deliver submissions straight to `suhaib.ishrat36@gmail.com`.
  - **Formspree**: Alternative endpoint configuration.
  - **Client-Side Validation & Feedback**: Real-time validation, loading spinner, clear success confirmation, and transparent configuration guidance.

### 5. Curated Shortlist / Personal Lookbook
- Visitors can bookmark any creation while browsing.
- Slide-out shortlist drawer displays saved creations.
- Single-click **"Enquire About Entire Shortlist"** compiles all selected items into a single consolidated enquiry sent to `suhaib.ishrat36@gmail.com`.

### 6. Contact & Flagship Boutiques Page
- General enquiry form.
- Flagship Showroom directory:
  - New Delhi Flagship (Khan Market)
  - New Delhi Heritage Studio (Sultanpur, MG Road)
  - Mumbai Boutique (Colaba)
  - Bengaluru Studio (Lavelle Road)
- Direct phone lines, email contact, operating hours, and private appointments.

---

## 🛠️ Configuration: Live Email Delivery

To activate instant live email delivery to **`suhaib.ishrat36@gmail.com`**:

1. Go to [https://web3forms.com](https://web3forms.com) (free, no sign-up password required).
2. Enter the destination email: **`suhaib.ishrat36@gmail.com`**.
3. Copy the access key you receive in your inbox.
4. Add the key to your `.env` file:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```
5. Restart or reload your development server. All form submissions from the website will now be delivered live to `suhaib.ishrat36@gmail.com`!

---

## 💻 Tech Stack

- **React 19**
- **Tailwind CSS v4** (with `@tailwindcss/vite`)
- **Vite 6**
- **Lucide React** (luxury minimalist iconography)
- **Google Fonts** (*Cormorant Garamond*, *Plus Jakarta Sans*, *Cinzel*)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
