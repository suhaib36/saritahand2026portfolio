import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, Mail, Phone, ChevronDown } from 'lucide-react';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function Navbar({
  currentView,
  onNavigate,
  shortlistCount = 0,
  onOpenShortlist,
  onOpenSearch,
  onOpenEnquiry,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Collections', view: 'collections' },
    {
      label: 'Products',
      view: 'catalogue',
      hasDropdown: true,
    },
    { label: 'About Us', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const quickCategories = [
    { name: 'Cushions', category: 'Cushions' },
    { name: 'Bed Linen', category: 'Bed Linen' },
    { name: 'Quilts', category: 'Quilts' },
    { name: 'Duvet Covers', category: 'Duvet Covers' },
    { name: 'Table Linen', category: 'Table Linen' },
    { name: 'Drapes', category: 'Drapes' },
    { name: 'Furniture', category: 'Furniture' },
    { name: 'Home Accessories', category: 'Home Accessories' },
    { name: "Kids' Collection", category: "Kids' Collection" },
  ];

  const handleLinkClick = (view, param) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DED0]/80 transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF8F5] text-[11px] font-sans tracking-wide py-2 px-4 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="tracking-wide-editorial">
              Complimentary Design Consultation & Bespoke Tailoring
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-300 text-[10px] uppercase tracking-wider">
            <a
              href={`mailto:${ENQUIRY_CONFIG.destinationEmail}`}
              className="hover:text-[#C5A880] transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-[#C5A880]" />
              <span>{ENQUIRY_CONFIG.destinationEmail}</span>
            </a>
            <span className="hidden md:inline text-stone-600">|</span>
            <a
              href={`tel:${ENQUIRY_CONFIG.conciergePhone}`}
              className="hover:text-[#C5A880] transition-colors hidden md:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span>{ENQUIRY_CONFIG.conciergePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-stone-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-900 ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              onClick={() => handleLinkClick('home')}
              className="inline-flex flex-col items-center lg:items-start group text-left"
            >
              <span className="font-serif text-2xl sm:text-3xl md:text-3xl tracking-[0.25em] text-stone-900 group-hover:text-[#A2644B] transition-colors uppercase font-normal">
                Sarita Handa
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.35em] text-stone-500 uppercase mt-0.5">
                Est. 1992 • Luxury Home & Textiles
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleLinkClick(link.view)}
                      className={`flex items-center gap-1 text-xs font-sans uppercase tracking-[0.2em] transition-colors py-2 ${
                        isActive
                          ? 'text-[#A2644B] font-semibold'
                          : 'text-stone-700 hover:text-[#A2644B]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Mega Dropdown for Categories */}
                    {productsDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white border border-[#E8DED0] shadow-xl p-6 z-50 animate-fade-in-down">
                        <div className="text-[10px] font-sans uppercase tracking-widest text-stone-400 pb-2 mb-3 border-b border-stone-100 flex items-center justify-between">
                          <span>Browse by Category</span>
                          <button
                            onClick={() => handleLinkClick('catalogue')}
                            className="text-[#A2644B] hover:underline"
                          >
                            View All Products →
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {quickCategories.map((c) => (
                            <button
                              key={c.category}
                              onClick={() => handleLinkClick('catalogue', { category: c.category })}
                              className="text-left p-2 text-xs font-sans text-stone-700 hover:text-stone-950 hover:bg-[#FAF8F5] transition-colors border-l-2 border-transparent hover:border-[#C5A880]"
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.view)}
                  className={`text-xs font-sans uppercase tracking-[0.2em] transition-colors py-2 relative ${
                    isActive
                      ? 'text-[#A2644B] font-semibold'
                      : 'text-stone-700 hover:text-[#A2644B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Trigger (desktop) */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-1.5 text-stone-700 hover:text-[#A2644B] transition-colors p-1.5"
              aria-label="Search collection"
              title="Search collection"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] font-sans uppercase tracking-wider text-stone-500">
                Search
              </span>
            </button>

            {/* Shortlist / Wishlist Trigger */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2 text-stone-700 hover:text-[#A2644B] transition-colors"
              aria-label="View curated shortlist"
              title="Curated Shortlist"
            >
              <Bookmark className="w-5 h-5" />
              {shortlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#A2644B] text-white text-[10px] font-sans font-bold flex items-center justify-center">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Primary Enquire Button */}
            <button
              onClick={() => onOpenEnquiry(null)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-stone-800 text-stone-900 text-[11px] font-sans uppercase tracking-widest hover:bg-[#1C1917] hover:text-[#FAF8F5] transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-t border-[#E8DED0] px-6 py-6 space-y-6 shadow-xl animate-fade-in-down">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                <button
                  onClick={() => handleLinkClick(link.view)}
                  className={`text-sm font-sans uppercase tracking-[0.2em] w-full text-left py-1.5 ${
                    currentView === link.view
                      ? 'text-[#A2644B] font-semibold'
                      : 'text-stone-800'
                  }`}
                >
                  {link.label}
                </button>

                {link.hasDropdown && (
                  <div className="grid grid-cols-2 gap-2 pl-3 pt-2 pb-1 border-l border-stone-200 mt-1">
                    {quickCategories.map((c) => (
                      <button
                        key={c.category}
                        onClick={() => handleLinkClick('catalogue', { category: c.category })}
                        className="text-left text-xs font-sans text-stone-600 hover:text-stone-900 py-1 truncate"
                      >
                        • {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-stone-200 space-y-3">
            <button
              onClick={() => {
                onOpenEnquiry(null);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest text-center"
            >
              Bespoke Design Enquiry
            </button>
            <div className="text-[11px] text-stone-500 text-center">
              Direct all inquiries to <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
