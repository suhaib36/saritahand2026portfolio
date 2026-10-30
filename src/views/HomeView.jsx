import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Feather, Compass, ShieldCheck, Mail, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS_DATA } from '../data/productsData';
import { COLLECTIONS_DATA } from '../data/collectionsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { BRAND_DATA } from '../data/brandData';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function HomeView({
  onNavigate,
  onViewProduct,
  onEnquireProduct,
  shortlist = [],
  onToggleShortlist,
}) {
  // Hero slides
  const heroSlides = [
    {
      title: "The Autumn Atelier 2026",
      subtitle: "The French Broderie Collection",
      tagline: "Fine Needlepoint & Monogram Washed Flax Linens",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1800&auto=format&fit=crop",
      targetCategory: "Cushions",
      targetCollection: "french-broderie",
    },
    {
      title: "Centuries of Silkcraft",
      subtitle: "Heritage Suzani Bedspreads & Quilts",
      tagline: "Central Asian Sunbursts & Generational Hand Kantha",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1800&auto=format&fit=crop",
      targetCategory: "Quilts",
      targetCollection: "heritage-suzani",
    },
    {
      title: "Artisanal Living Spaces",
      subtitle: "Solid Teak, Natural Cane & Bouclé",
      tagline: "Mid-Century Verandah Silhouettes & Tactile Comfort",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1800&auto=format&fit=crop",
      targetCategory: "Furniture",
      targetCollection: "artisanal-teak",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance hero slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const featuredProducts = PRODUCTS_DATA.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] min-h-[580px] max-h-[820px] w-full overflow-hidden bg-stone-900">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with dark luxury gradient */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl space-y-4 md:space-y-6 text-[#FAF8F5]">
                <div className="inline-block border border-[#C5A880]/70 bg-black/30 backdrop-blur-xs px-3.5 py-1 text-[11px] font-sans uppercase tracking-[0.25em] text-[#C5A880]">
                  {slide.subtitle}
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide text-white leading-[1.1]">
                  {slide.title}
                </h1>

                <p className="text-sm md:text-base font-sans text-stone-300 max-w-xl mx-auto font-light tracking-wide">
                  {slide.tagline}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => onNavigate('catalogue', { collection: slide.targetCollection })}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-stone-900 text-xs font-sans uppercase tracking-widest font-medium hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-lg"
                  >
                    Explore Collection
                  </button>
                  <button
                    onClick={() => onNavigate('catalogue')}
                    className="w-full sm:w-auto px-8 py-3.5 border border-white text-white text-xs font-sans uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-2xs"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Hero Controls */}
        <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-between max-w-7xl mx-auto px-6">
          {/* Slide dots */}
          <div className="flex items-center gap-2.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-8 bg-[#C5A880]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="w-10 h-10 border border-white/30 text-white hover:bg-white hover:text-stone-900 transition-colors flex items-center justify-center backdrop-blur-xs"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="w-10 h-10 border border-white/30 text-white hover:bg-white hover:text-stone-900 transition-colors flex items-center justify-center backdrop-blur-xs"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Heritage & Craft Preservation Since 1992
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal leading-snug">
            {BRAND_DATA.heritageStatement}
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto my-3" />
          <p className="text-stone-600 font-sans text-sm md:text-base leading-relaxed">
            {BRAND_DATA.brandIntro}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {BRAND_DATA.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 bg-white border border-[#E8DED0]/70 text-center space-y-3 hover:border-[#C5A880] transition-colors shadow-2xs group"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#E8DED0] flex items-center justify-center text-[#A2644B] group-hover:scale-110 transition-transform">
                {idx === 0 ? (
                  <Feather className="w-5 h-5" />
                ) : idx === 1 ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <Compass className="w-5 h-5" />
                )}
              </div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-stone-400">
                {pillar.subtitle}
              </div>
              <h3 className="font-serif text-xl text-stone-900">
                {pillar.title}
              </h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCT COLLECTIONS */}
      <section className="bg-[#F4EFE6]/70 py-16 md:py-20 border-y border-[#E8DED0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
                Curated Design Themes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
                Featured Collections
              </h2>
            </div>
            <button
              onClick={() => onNavigate('collections')}
              className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-stone-800 hover:text-[#A2644B] transition-colors pb-1 border-b border-stone-400"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS_DATA.slice(0, 3).map((col) => (
              <div
                key={col.id}
                onClick={() => onNavigate('catalogue', { collection: col.id })}
                className="group cursor-pointer bg-white border border-[#E8DED0] overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880]">
                      {col.tagline}
                    </div>
                    <h3 className="font-serif text-2xl text-white">
                      {col.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-sans text-stone-500 border-t border-stone-100">
                    <span className="italic font-serif text-stone-400">"{col.quote}"</span>
                    <span className="text-stone-900 font-medium group-hover:translate-x-1 transition-transform">
                      Browse →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Portfolio Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Explore by Category
          </h2>
          <p className="text-xs font-sans text-stone-600">
            From hand-embroidered accent cushions to solid timber furniture, discover handcrafted heirlooms tailored for thoughtful living.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('catalogue', { category: cat.name })}
              className="group cursor-pointer relative overflow-hidden aspect-[4/5] bg-stone-200 border border-[#E8DED0] hover:shadow-lg transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent group-hover:from-stone-950/90 transition-all" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#C5A880]">
                  {cat.tagline}
                </span>
                <h3 className="font-serif text-lg md:text-xl font-normal">
                  {cat.name}
                </h3>
                <div className="pt-1 text-[11px] font-sans text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Catalogue →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
              Iconic Pieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              Featured Creations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalogue')}
            className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-stone-800 hover:text-[#A2644B] transition-colors pb-1 border-b border-stone-400"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
              onEnquire={onEnquireProduct}
              isShortlisted={shortlist.some((item) => item.id === product.id)}
              onToggleShortlist={onToggleShortlist}
            />
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL LIFESTYLE SECTION: "LIVING WITH SARITA HANDA" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-[#FAF8F5] p-8 md:p-14 border border-[#C5A880]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880]">
                Editorial Lookbook
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                Living with Sarita Handa
              </h2>
              <p className="text-xs md:text-sm font-sans text-stone-300 leading-relaxed">
                Quiet luxury is not an aesthetic — it is a daily rhythm. It lives in the weight of washed Belgian linen on a languid Sunday, the subtle elevation of a hand-embroidered French knot under lamplight, and the quiet dignity of solid teak aged with beeswax.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('collections')}
                  className="px-6 py-3 bg-[#C5A880] text-[#1C1917] text-xs font-sans uppercase tracking-widest font-medium hover:bg-white transition-colors"
                >
                  View Lookbook Stories
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden bg-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
                    alt="Master Suite Lookbook"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-[11px] font-sans text-stone-400">
                  The Master Suite • Washed Flax Linen
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="aspect-[3/4] overflow-hidden bg-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop"
                    alt="Artisanal Seating Lookbook"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-[11px] font-sans text-stone-400">
                  The Sunlit Verandah • Malabar Teak & Cane
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRAND CRAFTSMANSHIP & NEEDLEWORK PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Generational Stitches
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            The Art of the Needle
          </h2>
          <p className="text-xs font-sans text-stone-600">
            Every motif begins with an artisan's steady hand, honoring techniques that have adorned royal court textiles and ancestral Indian dowries for centuries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_DATA.techniques.map((tech, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-[#E8DED0] space-y-2 hover:border-[#C5A880] transition-colors"
            >
              <div className="text-2xl font-serif text-[#C5A880]">0{idx + 1}</div>
              <h3 className="font-serif text-xl text-stone-900">{tech.name}</h3>
              <div className="text-[10px] font-sans uppercase tracking-wider text-[#A2644B]">
                {tech.origin}
              </div>
              <p className="text-xs font-sans text-stone-600 leading-relaxed pt-1">
                {tech.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BESPOKE ENQUIRY CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#F4EFE6] border border-[#C5A880]/60 p-8 sm:p-12 md:p-16 text-center space-y-6">
          <div className="inline-block px-3 py-1 bg-white border border-[#C5A880] text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
            Private Concierge & Trade Services
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 max-w-2xl mx-auto leading-snug">
            Collaborate With Our Textile & Interior Design Concierge
          </h2>

          <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-xl mx-auto leading-relaxed">
            Whether furnishing a private residence, commissioning custom drapery dimensions, or sourcing bespoke textiles for luxury hospitality projects, our concierge team is at your disposal.
          </p>

          <div className="text-xs font-sans text-stone-700">
            All enquiries are delivered directly to <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onEnquireProduct(null)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-md"
            >
              Submit Bespoke Enquiry
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 border border-stone-800 text-stone-900 text-xs font-sans uppercase tracking-widest hover:bg-stone-100 transition-colors"
            >
              Visit Showrooms & Studios
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
