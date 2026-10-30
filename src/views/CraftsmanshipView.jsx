import React from 'react';
import { Feather, Heart, Sparkles, Award, Shield, Users, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { BRAND_DATA } from '../data/brandData';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function CraftsmanshipView({ onNavigate, onEnquire }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">
      <Breadcrumb
        items={[{ label: 'About Us & Craftsmanship' }]}
        onNavigate={onNavigate}
      />

      {/* Hero Narrative */}
      <div className="relative overflow-hidden bg-[#1C1917] text-[#FAF8F5] p-8 md:p-16 border border-[#C5A880]/30">
        <div className="max-w-3xl space-y-6">
          <span className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880]">
            The Sarita Handa Story • Est. 1992
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight">
            A Legacy of Needlework, Soul & Timeless Interiors
          </h1>
          <div className="w-16 h-0.5 bg-[#C5A880]" />
          <p className="text-stone-300 font-sans text-sm md:text-base leading-relaxed">
            Founded thirty-four years ago by Sarita Handa, the eponymous luxury textile house began with a singular conviction: that India's incomparable needlecraft heritage could be elevated to the pinnacle of global luxury interior design.
          </p>
        </div>
      </div>

      {/* Chapter 1: The Founders & Revival */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Craft Revival & Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Reviving Endangered Stitches, Thread by Thread
          </h2>
          <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
            In the early 1990s, fine hand embroidery was endangered by rapid industrialization. Sarita Handa traveled to rural artisan clusters across northern India, re-engaging master needleworkers and introducing European linen canvases, refined color palettes, and international quality standards.
          </p>
          <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
            Joined by her daughter Suparna Handa as Managing Director, the brand expanded from export couture textiles to comprehensive residential interiors, custom furniture, and bespoke drapery for some of the world's most distinguished private homes and luxury resorts.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[4/5] overflow-hidden bg-stone-200 border border-[#E8DED0]">
            <img
              src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop"
              alt="Needlework detail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-stone-200 border border-[#E8DED0] pt-6">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
              alt="Artisanal bed linen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Chapter 2: Artisan Empowerment & Community */}
      <section className="bg-[#F4EFE6] p-8 md:p-14 border border-[#C5A880]/50 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Social Impact & Craft Sustenance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Empowering 1,500+ Female Artisans
          </h2>
          <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
            At the core of every Sarita Handa cushion and quilt is the dignity of the artisan. Our decentralized production model allows rural craftswomen to earn independent incomes within their own village communities while caring for their families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-white border border-[#E8DED0] space-y-2">
            <Users className="w-6 h-6 text-[#A2644B]" />
            <h3 className="font-serif text-xl text-stone-900">Dignified Livelihoods</h3>
            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              Fair-wage compensation, healthcare stipends, and continuous skill refinement for generational embroiderers.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E8DED0] space-y-2">
            <Heart className="w-6 h-6 text-[#A2644B]" />
            <h3 className="font-serif text-xl text-stone-900">Preserving Culture</h3>
            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              Documenting and safeguarding ancient stitches from Kashmir, Punjab, Rajasthan, and Gujarat.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E8DED0] space-y-2">
            <Shield className="w-6 h-6 text-[#A2644B]" />
            <h3 className="font-serif text-xl text-stone-900">Honest Materials</h3>
            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              Certified European flax, organic long-staple cotton, natural non-toxic vegetable dyes, and plantation timber.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Techniques Grid */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Artisanal Taxonomy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            The Signatures of Sarita Handa
          </h2>
          <p className="text-xs font-sans text-stone-600">
            Each stitch requires specialized dexterity honed over decades of practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_DATA.techniques.map((tech, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-[#E8DED0] space-y-3 hover:border-[#C5A880] transition-colors"
            >
              <div className="text-3xl font-serif text-[#C5A880]">0{i + 1}</div>
              <h3 className="font-serif text-xl text-stone-900">{tech.name}</h3>
              <div className="text-[10px] font-sans uppercase tracking-wider text-[#A2644B]">
                {tech.origin}
              </div>
              <p className="text-xs font-sans text-stone-600 leading-relaxed">
                {tech.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 4: Press Accolades */}
      <section className="bg-white border border-[#E8DED0] p-8 md:p-14 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Critical Acclaim
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-1">
            Featured In The Press
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRAND_DATA.pressFeatures.map((press, idx) => (
            <div key={idx} className="space-y-3 text-center border-l-2 md:border-l-0 md:border-t-2 border-[#C5A880] pl-4 md:pl-0 md:pt-4">
              <h3 className="font-serif text-xl font-normal text-stone-900">
                {press.outlet}
              </h3>
              <blockquote className="italic font-serif text-stone-600 text-xs sm:text-sm leading-relaxed">
                "{press.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Experience Sarita Handa In Person
        </h2>
        <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-lg mx-auto leading-relaxed">
          Visit our flagship boutiques in Delhi and Mumbai, or connect with our concierge team to commission bespoke creations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all"
          >
            Showroom Directory
          </button>
          <button
            onClick={() => onEnquire({ name: 'General Craft & Design Consultation' })}
            className="px-8 py-3.5 border border-stone-800 text-stone-900 text-xs font-sans uppercase tracking-widest hover:bg-stone-50 transition-colors"
          >
            Enquire to {ENQUIRY_CONFIG.destinationEmail}
          </button>
        </div>
      </section>
    </div>
  );
}
