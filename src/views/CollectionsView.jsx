import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { COLLECTIONS_DATA } from '../data/collectionsData';
import { PRODUCTS_DATA } from '../data/productsData';

export default function CollectionsView({
  collections = COLLECTIONS_DATA,
  products = PRODUCTS_DATA,
  onNavigate,
  onEnquire,
}) {
  const activeCollections = collections && collections.length > 0 ? collections : COLLECTIONS_DATA;
  const activeProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumb
        items={[{ label: 'Collections' }]}
        onNavigate={onNavigate}
      />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
          Curated Design Archives
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-normal">
          The Collections
        </h1>
        <div className="w-12 h-0.5 bg-[#C5A880] mx-auto my-2" />
        <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          Each Sarita Handa collection represents a dedicated aesthetic inquiry — bridging centuries of needlework traditions with modern silhouettes, tactile linen weaves, and architectural warmth.
        </p>
      </div>

      {/* Collections Lookbook Stack */}
      <div className="space-y-20">
        {activeCollections.map((col, index) => {
          const isEven = index % 2 === 0;
          const colProducts = activeProducts.filter((p) => p.collectionId === col.id || p.collection === col.name);

          return (
            <section
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center p-6 md:p-10 bg-white border border-[#E8DED0] shadow-xs ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Column */}
              <div
                className={`lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-stone-100 ${
                  !isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={col.coverImage}
                  alt={col.name}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1C1917]/90 text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1">
                    {col.year || 'Curated Signature'}
                  </span>
                </div>
              </div>

              {/* Text Column */}
              <div
                className={`lg:col-span-5 space-y-5 ${
                  !isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#A2644B] font-semibold">
                  {col.tagline}
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-snug">
                  {col.name}
                </h2>

                <blockquote className="italic font-serif text-stone-500 text-sm border-l-2 border-[#C5A880] pl-3 py-0.5">
                  "{col.quote}"
                </blockquote>

                <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onNavigate('catalogue', { collection: col.id })}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all"
                  >
                    <span>View Collection Pieces</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEnquire({ name: `${col.name} Collection Consultation` })}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-stone-300 text-stone-800 text-xs font-sans uppercase tracking-widest hover:bg-stone-50 transition-colors"
                  >
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
