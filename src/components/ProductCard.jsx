import React, { useState } from 'react';
import { Eye, Mail, Bookmark, BookmarkCheck } from 'lucide-react';

export default function ProductCard({
  product,
  onViewDetails,
  onEnquire,
  isShortlisted = false,
  onToggleShortlist,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const secondaryImage = product.images?.[1] || product.images?.[0];

  return (
    <article
      className="group relative flex flex-col bg-white border border-[#E8DED0]/60 transition-all duration-500 hover:shadow-xl hover:border-[#C5A880]/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with secondary hover swap */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F4EFE6]">
        <img
          src={isHovered && secondaryImage ? secondaryImage : product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-[#1C1917]/90 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase font-sans tracking-widest px-2.5 py-1">
              {product.badge}
            </span>
          </div>
        )}

        {/* Shortlist bookmark toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist?.(product);
          }}
          aria-label={isShortlisted ? 'Remove from curated shortlist' : 'Add to curated shortlist'}
          title={isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-[#C5A880] transition-colors shadow-xs"
        >
          {isShortlisted ? (
            <BookmarkCheck className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Quick View overlay on hover (desktop) */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white text-stone-900 text-xs font-sans uppercase tracking-wider font-medium hover:bg-[#FAF8F5] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Quick View</span>
          </button>
          <button
            onClick={() => onEnquire(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-wider font-medium hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Collection */}
          <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase text-stone-500 mb-1.5">
            <span>{product.category}</span>
            {product.collection && (
              <span className="text-[#A2644B] font-medium truncate max-w-[140px]">
                {product.collection}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif text-lg font-medium text-stone-900 hover:text-[#A2644B] cursor-pointer transition-colors leading-snug line-clamp-1 mb-2"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Colors Swatches Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-4 pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-sans tracking-wider text-stone-400 mr-1">
                Colors:
              </span>
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  title={color.name}
                  className="w-3 h-3 rounded-full border border-stone-300 inline-block shadow-2xs"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}

          {/* Action Buttons for Mobile / Default */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => onViewDetails(product)}
              className="py-2.5 px-2 border border-stone-300 text-stone-800 text-[11px] font-sans uppercase tracking-wider text-center hover:bg-stone-50 hover:border-stone-400 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => onEnquire(product)}
              className="py-2.5 px-2 bg-[#1C1917] text-[#FAF8F5] text-[11px] font-sans uppercase tracking-wider text-center hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
