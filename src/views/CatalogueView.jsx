import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { PRODUCTS_DATA } from '../data/productsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { COLLECTIONS_DATA } from '../data/collectionsData';

export default function CatalogueView({
  initialFilters = {},
  onNavigate,
  onViewProduct,
  onEnquireProduct,
  shortlist = [],
  onToggleShortlist,
}) {
  // State for all filters
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'All');
  const [selectedCollection, setSelectedCollection] = useState(initialFilters.collection || 'All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync initialFilters prop if passed from outside (e.g. clicking category in navbar or home)
  useEffect(() => {
    if (initialFilters.category) {
      setSelectedCategory(initialFilters.category);
    }
    if (initialFilters.collection) {
      // Find collection id or name
      const matched = COLLECTIONS_DATA.find((c) => c.id === initialFilters.collection || c.name === initialFilters.collection);
      if (matched) setSelectedCollection(matched.name);
    }
    if (initialFilters.query) {
      setSearchQuery(initialFilters.query);
    }
  }, [initialFilters]);

  // Derived filter options
  const colorOptions = [
    { name: 'All', hex: '' },
    { name: 'Warm Alabaster', hex: '#FAF8F5' },
    { name: 'Oatmeal Sand', hex: '#D6C6B2' },
    { name: 'Terracotta Clay', hex: '#A2644B' },
    { name: 'Antique Sage', hex: '#5E6B5D' },
    { name: 'Forest Moss', hex: '#434E42' },
    { name: 'Smoky Charcoal', hex: '#292524' },
    { name: 'Natural Warm Teak', hex: '#8C6C42' },
    { name: 'Antique Brass', hex: '#C5A880' },
  ];

  const materialOptions = [
    'All',
    'Linen',
    'Cotton',
    'Velvet',
    'Wool',
    'Teak',
    'Stone & Brass',
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Collection filter
      if (selectedCollection !== 'All') {
        const matchedCol = COLLECTIONS_DATA.find(
          (c) => c.name === selectedCollection || c.id === selectedCollection
        );
        if (matchedCol && product.collectionId !== matchedCol.id && product.collection !== selectedCollection) {
          return false;
        }
      }

      // Color filter
      if (selectedColor !== 'All') {
        const hasColor = product.colors?.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }

      // Material filter
      if (selectedMaterial !== 'All') {
        if (!product.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.collection.toLowerCase().includes(q) ||
          product.material.toLowerCase().includes(q) ||
          product.shortDescription.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      if (sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [selectedCategory, selectedCollection, selectedColor, selectedMaterial, searchQuery, sortBy]);

  // Clear all filters handler
  const handleClearAll = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedColor('All');
    setSelectedMaterial('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedCollection !== 'All' ||
    selectedColor !== 'All' ||
    selectedMaterial !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Catalogue', view: 'catalogue' },
          ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : []),
        ]}
        onNavigate={onNavigate}
      />

      {/* Page Title & Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
          The Product Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal">
          {selectedCategory === 'All' ? 'Complete Catalogue' : selectedCategory}
        </h1>
        <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          Explore artisanal home textiles, fine needlecraft, and handcrafted furniture. Select any creation to request bespoke sizing, fabric samples, or availability directly.
        </p>
      </div>

      {/* Category Pills Bar (Horizontal Scrollable) */}
      <div className="border-b border-[#E8DED0] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 text-xs font-sans uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#1C1917] text-[#FAF8F5]'
                : 'bg-white border border-[#E8DED0] text-stone-700 hover:border-stone-400'
            }`}
          >
            All Categories ({PRODUCTS_DATA.length})
          </button>
          {CATEGORIES_DATA.map((cat) => {
            const count = PRODUCTS_DATA.filter((p) => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 text-xs font-sans uppercase tracking-widest whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FAF8F5]'
                    : 'bg-white border border-[#E8DED0] text-stone-700 hover:border-stone-400'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort / Filter Bar */}
      <div className="bg-white border border-[#E8DED0] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, fabric, craft..."
            className="w-full pl-9 pr-8 py-2 text-xs font-sans bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & Filter Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-stone-300 text-xs font-sans uppercase tracking-wider text-stone-800"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-sans text-stone-600">
            <span className="hidden sm:inline text-stone-400 uppercase tracking-wider text-[10px]">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-stone-800 focus:outline-hidden focus:border-[#C5A880] text-xs font-sans"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="name-asc">Alphabetical (A – Z)</option>
              <option value="name-desc">Alphabetical (Z – A)</option>
            </select>
          </div>

          {/* Results count */}
          <span className="text-xs font-sans text-stone-500 whitespace-nowrap hidden sm:inline">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'creation' : 'creations'}
          </span>
        </div>
      </div>

      {/* Main Grid with Desktop Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6 bg-white p-6 border border-[#E8DED0] h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="font-serif text-lg text-stone-900 font-normal">
              Filter Portfolio
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 text-[11px] font-sans text-[#A2644B] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Collection Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-sans uppercase tracking-widest text-stone-600 font-semibold block">
              Collection
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full p-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden focus:border-[#C5A880]"
            >
              <option value="All">All Collections</option>
              {COLLECTIONS_DATA.map((col) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-sans uppercase tracking-widest text-stone-600 font-semibold block">
              Color Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 p-1.5 text-xs text-left transition-colors border ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#FAF8F5] font-medium text-stone-900'
                        : 'border-transparent hover:border-stone-200 text-stone-600'
                    }`}
                  >
                    {c.hex ? (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300 bg-stone-100 shrink-0" />
                    )}
                    <span className="truncate text-[11px]">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-sans uppercase tracking-widest text-stone-600 font-semibold block">
              Material & Fibre
            </label>
            <div className="flex flex-wrap gap-1.5">
              {materialOptions.map((mat) => {
                const isSelected = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-2.5 py-1 text-[11px] font-sans transition-colors border ${
                      isSelected
                        ? 'bg-[#1C1917] text-white border-[#1C1917]'
                        : 'bg-[#FAF8F5] text-stone-700 border-[#E8DED0] hover:border-stone-400'
                    }`}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enquiries Note */}
          <div className="pt-4 border-t border-stone-200 text-xs font-sans text-stone-500 space-y-1">
            <div className="font-semibold text-stone-800">Bespoke Customization</div>
            <p className="leading-relaxed">
              Custom dimensions and color schemes available on request. Inquiries routed to suhaib.ishrat36@gmail.com.
            </p>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 text-xs font-sans">
              <span className="text-stone-400 uppercase tracking-wider text-[10px]">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#C5A880] px-2.5 py-1 text-stone-800">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                  </button>
                </span>
              )}
              {selectedCollection !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#C5A880] px-2.5 py-1 text-stone-800">
                  Collection: {selectedCollection}
                  <button onClick={() => setSelectedCollection('All')}>
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                  </button>
                </span>
              )}
              {selectedColor !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#C5A880] px-2.5 py-1 text-stone-800">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor('All')}>
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                  </button>
                </span>
              )}
              {selectedMaterial !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#C5A880] px-2.5 py-1 text-stone-800">
                  Material: {selectedMaterial}
                  <button onClick={() => setSelectedMaterial('All')}>
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#C5A880] px-2.5 py-1 text-stone-800">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearAll}
                className="text-[#A2644B] hover:underline uppercase tracking-wider text-[10px] ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E8DED0] p-12 text-center space-y-4">
              <h3 className="font-serif text-2xl text-stone-800">
                No Creations Match Your Selected Criteria
              </h3>
              <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-md mx-auto">
                Try resetting some filters or searching for broader terms like "linen", "cushion", or "suzani".
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2.5 bg-[#1C1917] text-white text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-[#FAF8F5] h-full shadow-2xl p-6 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl text-stone-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Collection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-wider text-stone-700 font-semibold block">
                Collection
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full p-2 bg-white border border-[#E8DED0] text-xs font-sans text-stone-800"
              >
                <option value="All">All Collections</option>
                {COLLECTIONS_DATA.map((col) => (
                  <option key={col.id} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-wider text-stone-700 font-semibold block">
                Color
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`p-2 text-xs border text-left truncate ${
                      selectedColor === c.name
                        ? 'border-[#C5A880] bg-white font-medium'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-wider text-stone-700 font-semibold block">
                Material
              </label>
              <div className="flex flex-wrap gap-1.5">
                {materialOptions.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-2.5 py-1 text-xs border ${
                      selectedMaterial === mat
                        ? 'bg-[#1C1917] text-white border-[#1C1917]'
                        : 'bg-white text-stone-700 border-stone-200'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={handleClearAll}
                className="w-1/2 py-2.5 border border-stone-300 text-xs font-sans uppercase tracking-wider text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 bg-[#1C1917] text-white text-xs font-sans uppercase tracking-wider"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
