import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { InstagramIcon, FacebookIcon, PinterestIcon } from './SocialIcons';
import { BRAND_DATA } from '../data/brandData';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function Footer({ onNavigate, onOpenEnquiry }) {
  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-10 border-t border-[#C5A880]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-stone-800">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl tracking-[0.2em] uppercase font-normal text-white">
              Sarita Handa
            </h3>
            <p className="text-xs font-sans text-stone-400 leading-relaxed max-w-sm">
              Celebrating three decades of master embroidery, pure natural fibres, and architectural home furnishings. Honoring generational Indian needlecraft through an international luxury design sensibility.
            </p>
            <div className="pt-2 text-xs font-sans text-[#C5A880]">
              <span>Official Destination for Enquiries: </span>
              <a
                href={`mailto:${ENQUIRY_CONFIG.destinationEmail}`}
                className="underline hover:text-white transition-colors"
              >
                {ENQUIRY_CONFIG.destinationEmail}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A880]">
              Portfolio
            </h4>
            <ul className="space-y-2 text-xs font-sans text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { category: 'Cushions' })}
                  className="hover:text-white transition-colors"
                >
                  Cushions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { category: 'Bed Linen' })}
                  className="hover:text-white transition-colors"
                >
                  Bed Linen & Sheets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { category: 'Quilts' })}
                  className="hover:text-white transition-colors"
                >
                  Handcrafted Quilts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { category: 'Table Linen' })}
                  className="hover:text-white transition-colors"
                >
                  Table Linen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { category: 'Furniture' })}
                  className="hover:text-white transition-colors"
                >
                  Solid Teak Furniture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="text-[#C5A880] hover:underline transition-colors"
                >
                  View All Products →
                </button>
              </li>
            </ul>
          </div>

          {/* Heritage & Brand */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A880]">
              The House
            </h4>
            <ul className="space-y-2 text-xs font-sans text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Our Craftsmanship & Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Flagship Boutiques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenEnquiry(null)}
                  className="hover:text-white transition-colors"
                >
                  Bespoke Design Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Trade & Hospitality
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom & Concierge */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A880]">
              Concierge Care
            </h4>
            <div className="space-y-2.5 text-xs font-sans text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Khan Market, New Delhi & Colaba, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>+91 11 4052 4750</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">{ENQUIRY_CONFIG.destinationEmail}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onOpenEnquiry(null)}
                  className="text-xs uppercase font-sans tracking-widest text-[#C5A880] hover:text-white underline transition-colors"
                >
                  Schedule Private Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
          <div>
            © {new Date().getFullYear()} Sarita Handa Exports Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">Handcrafted in India</span>
            <span>•</span>
            <span className="text-stone-400">All Enquiries: {ENQUIRY_CONFIG.destinationEmail}</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-stone-500 hover:text-[#C5A880] transition-colors uppercase tracking-wider text-[10px]"
            >
              Portal Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
