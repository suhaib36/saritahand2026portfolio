import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Tag } from 'lucide-react';

export default function QuickSearchModal({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  onViewAllResults,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTags = [
    'Pure Linen',
    'Suzani',
    'Kashmiri Crewel',
    'Cushions',
    'Velvet',
    'French Broderie',
    'Teak Furniture',
    'Table Runner'
  ];

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }).slice(0, 6);

  const handleSelectTag = (tag) => {
    setQuery(tag);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] border border-[#C5A880]/40 shadow-2xl overflow-hidden animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-[#E8DED0] bg-white p-4 md:p-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cushions, bed linen, quilts, furniture, fabrics..."
            className="w-full text-base md:text-lg font-serif placeholder:font-sans placeholder:text-stone-400 text-stone-900 focus:outline-hidden bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase font-sans tracking-widest text-stone-500 hover:text-stone-900 ml-2 pl-2 border-l border-stone-200"
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div className="text-[11px] font-sans uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#A2644B]" />
                <span>Trending Searches & Curations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="px-3 py-1.5 bg-white border border-[#E8DED0] hover:border-[#C5A880] text-xs font-sans text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="font-serif text-lg text-stone-800">
                No creations found matching "{query}"
              </p>
              <p className="text-xs font-sans text-stone-500 max-w-sm mx-auto">
                Try searching by craft type such as 'linen', 'crewel', 'quilt', or browse our full catalogue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-sans text-stone-500 pb-2 border-b border-stone-200">
                <span>Matching Results ({filteredProducts.length})</span>
                <button
                  onClick={() => {
                    onViewAllResults(query);
                    onClose();
                  }}
                  className="text-[#A2644B] hover:underline uppercase tracking-wider text-[11px]"
                >
                  View all in Catalogue →
                </button>
              </div>

              <div className="grid grid-cols-1 divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 flex items-center gap-4 hover:bg-white px-2 -mx-2 transition-colors cursor-pointer group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-sans tracking-widest text-[#A2644B]">
                        {product.category} • {product.collection}
                      </div>
                      <h4 className="font-serif text-base text-stone-900 group-hover:text-[#A2644B] transition-colors truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs text-stone-500 truncate">
                        {product.material}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
