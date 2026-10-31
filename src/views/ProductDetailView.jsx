import React, { useState } from 'react';
import {
  Mail,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  Info,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { PRODUCTS_DATA } from '../data/productsData';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function ProductDetailView({
  product,
  products = PRODUCTS_DATA,
  onNavigate,
  onViewProduct,
  onEnquireProduct,
  shortlist = [],
  onToggleShortlist,
  onShowToast,
}) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || product.primaryColor || ''
  );
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'technique' | 'care'

  const isShortlisted = shortlist.some((item) => item.id === product.id);

  // Related products (same category or collection, excluding current)
  const activeProducts = products && products.length > 0 ? products : PRODUCTS_DATA;
  const relatedProducts = activeProducts.filter(
    (p) =>
      p.id !== product.id &&
      (p.categoryId === product.categoryId || p.category === product.category || p.collectionId === product.collectionId)
  ).slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast?.({
        type: 'info',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Catalogue', view: 'catalogue' },
          { label: product.category, view: 'catalogue', param: { category: product.category } },
          { label: product.name },
        ]}
        onNavigate={onNavigate}
      />

      {/* Main Product Showcase (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#E8DED0] overflow-hidden group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-700"
            />

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block bg-[#1C1917]/90 backdrop-blur-xs text-[#FAF8F5] text-xs uppercase font-sans tracking-widest px-3 py-1.5">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 shrink-0 bg-[#F4EFE6] border overflow-hidden transition-all ${
                    idx === activeImageIndex
                      ? 'border-[#1C1917] ring-1 ring-[#1C1917]'
                      : 'border-[#E8DED0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Narrative & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category, Collection & SKU */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-sans tracking-widest uppercase text-stone-500">
              <span>{product.category}</span>
              <span className="text-stone-400 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>
            {product.collection && (
              <div className="text-xs font-sans uppercase tracking-[0.2em] text-[#A2644B] font-medium">
                Collection: {product.collection}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
            {product.name}
          </h1>

          {/* Short & Detailed Descriptions */}
          <div className="space-y-3 text-stone-700 font-sans text-sm leading-relaxed border-t border-b border-stone-200 py-4">
            <p className="font-medium text-stone-900">
              {product.shortDescription}
            </p>
            <p className="text-stone-600 text-xs sm:text-sm">
              {product.fullDescription}
            </p>
          </div>

          {/* Available Colours Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="uppercase tracking-widest text-stone-500 font-semibold">
                  Selected Color:
                </span>
                <span className="text-stone-900 font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative p-0.5 rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#1C1917] ring-2 ring-[#C5A880]'
                          : 'border-transparent hover:border-stone-400'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-stone-300"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Quick Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs font-sans text-stone-700 bg-[#F4EFE6]/70 p-3.5 border border-[#E8DED0]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                Dimensions
              </span>
              <span className="font-medium">{product.dimensions}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                Primary Material
              </span>
              <span className="font-medium truncate block">{product.material}</span>
            </div>
          </div>

          {/* Primary Action Button: Prominent Enquire About This Product */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onEnquireProduct(product)}
              className="w-full py-4 px-6 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-[0.25em] font-semibold hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#C5A880]" />
              <span>Enquire About This Product</span>
            </button>

            {/* Secondary Actions: Shortlist & Share */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onToggleShortlist(product)}
                className="py-3 px-4 border border-stone-300 text-stone-800 text-xs font-sans uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                {isShortlisted ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#A2644B] fill-[#A2644B]" />
                    <span>In Shortlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Add to Shortlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="py-3 px-4 border border-stone-300 text-stone-800 text-xs font-sans uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Piece</span>
              </button>
            </div>
          </div>

          {/* Concierge Assurance Box */}
          <div className="bg-white border border-[#E8DED0] p-4 text-xs font-sans text-stone-600 space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#A2644B]" />
              <span>Direct Client Concierge Service</span>
            </div>
            <p className="leading-relaxed">
              All inquiries regarding this piece are delivered directly to{' '}
              <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>. Custom sizing, bespoke embroidery palettes, and hospitality project inquiries are welcome.
            </p>
          </div>

          {/* Tabs for Detailed Specifications */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-3 text-xs font-sans uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-[#1C1917] font-semibold text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('technique')}
                className={`pb-2.5 px-3 text-xs font-sans uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'technique'
                    ? 'border-[#1C1917] font-semibold text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Craftsmanship
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 px-3 text-xs font-sans uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-[#1C1917] font-semibold text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Care & Lead Time
              </button>
            </div>

            <div className="py-4 text-xs font-sans text-stone-600 leading-relaxed">
              {activeTab === 'specs' && (
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Dimensions:</span>
                    <span className="font-medium text-stone-900">{product.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Material:</span>
                    <span className="font-medium text-stone-900">{product.material}</span>
                  </div>
                  {product.specifications &&
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">{key}:</span>
                        <span className="font-medium text-stone-900">{value}</span>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'technique' && (
                <div className="space-y-2">
                  <p className="font-medium text-stone-900">{product.technique}</p>
                  <p className="text-stone-600">{product.story}</p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-stone-900 block mb-1">Care Guidelines:</span>
                    <p>{product.care}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block mb-1">Lead Time:</span>
                    <p>{product.leadTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story / Craft Section */}
      <div className="bg-[#1C1917] text-[#FAF8F5] p-8 md:p-12 border border-[#C5A880]/30 space-y-4">
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880]">
            The Story Behind The Piece
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-normal">
            Heritage Stitched into Everyday Living
          </h2>
          <p className="text-xs md:text-sm font-sans text-stone-300 leading-relaxed">
            {product.story}
          </p>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-[#E8DED0]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
                Curated Companions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-1">
                Related Creations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalogue', { category: product.category })}
              className="text-xs font-sans uppercase tracking-widest text-stone-800 hover:text-[#A2644B] pb-1 border-b border-stone-300 transition-colors"
            >
              View More in {product.category} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onViewDetails={onViewProduct}
                onEnquire={onEnquireProduct}
                isShortlisted={shortlist.some((item) => item.id === rel.id)}
                onToggleShortlist={onToggleShortlist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
