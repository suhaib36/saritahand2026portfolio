import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, Info, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { submitEnquiry } from '../services/enquiryService';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function EnquiryModal({
  isOpen,
  onClose,
  product = null,
  shortlist = null,
  initialEnquiryType = 'Product Availability & Bespoke Enquiry',
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    productName: '',
    category: '',
    enquiryType: initialEnquiryType,
    quantity: '1',
    message: '',
    botField: '', // Honeypot field for anti-spam
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Sync prefilled product or shortlist data when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSubmitResult(null);
      setFormErrors({});
      return;
    }

    if (shortlist && shortlist.length > 0) {
      const itemsList = shortlist.map((item) => `${item.name} (${item.category})`).join(', ');
      setFormData((prev) => ({
        ...prev,
        productName: `Shortlist (${shortlist.length} creations): ${itemsList}`,
        category: 'Curated Portfolio Shortlist',
        enquiryType: 'Curated Shortlist Consultation',
        message: prev.message || `I am interested in acquiring or learning more about the following shortlisted creations:\n- ${shortlist.map((i) => i.name).join('\n- ')}\n\nPlease provide availability, bespoke dimensions, and lead times.`,
      }));
    } else if (product) {
      setFormData((prev) => ({
        ...prev,
        productName: product.name,
        category: product.category,
        enquiryType: initialEnquiryType,
        message: prev.message || `I am enquiring about ${product.name} (SKU: ${product.sku || 'N/A'}). Please share availability, fabric swatch availability, and bespoke custom sizing options.`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        productName: 'General Design Consultation & Portfolio Enquiry',
        category: 'Interior Design Concierge',
        enquiryType: 'Bespoke Residential Consultation',
        message: prev.message || 'I would like to schedule an interior design consultation and explore Sarita Handa textiles for my residence.',
      }));
    }
  }, [isOpen, product, shortlist, initialEnquiryType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setSubmitResult(null);

    try {
      const response = await submitEnquiry({
        ...formData,
        shortlist: shortlist || null,
      });

      if (response.success) {
        setSubmitResult({
          success: true,
          simulated: response.simulated,
          destination: response.destination,
          message: response.message,
          payload: response.payload,
        });
      } else {
        if (response.validationErrors) {
          setFormErrors(response.validationErrors);
        }
        setSubmitResult({
          success: false,
          error: response.error,
        });
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        error: 'An unexpected error occurred while transmitting your enquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#C5A880]/40 shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1C1917] text-[#FAF8F5] px-6 py-5 flex items-center justify-between border-b border-[#C5A880]/30">
          <div>
            <div className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880] mb-0.5">
              Client Concierge & Bespoke Enquiries
            </div>
            <h2 id="enquiry-modal-title" className="font-serif text-2xl tracking-wide font-normal">
              {product ? 'Product Enquiry' : shortlist ? 'Shortlist Enquiry' : 'Design Consultation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[82vh] overflow-y-auto">
          {/* Success State */}
          {submitResult && submitResult.success ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#5E6B5D]/10 flex items-center justify-center text-[#5E6B5D]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-sans uppercase tracking-widest text-[#A2644B]">
                  Enquiry Registered
                </span>
                <h3 className="font-serif text-3xl text-stone-900 mt-1 mb-3">
                  Thank You, {formData.fullName}
                </h3>
                <p className="text-sm font-sans text-stone-600 max-w-lg mx-auto leading-relaxed">
                  Your enquiry regarding <span className="font-semibold text-stone-900">"{formData.productName}"</span> has been successfully logged for delivery to{' '}
                  <span className="font-semibold text-[#A2644B] underline decoration-stone-300">
                    {submitResult.destination}
                  </span>.
                </p>
              </div>

              {/* Status Note on Integration */}
              {submitResult.simulated ? (
                <div className="bg-[#F4EFE6] border border-[#C5A880]/40 p-4 text-left max-w-lg mx-auto text-xs text-stone-700 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-stone-900">
                    <Info className="w-4 h-4 text-[#A2644B] shrink-0" />
                    <span>Live Transmission Configuration Notice</span>
                  </div>
                  <p className="leading-relaxed">
                    Client validation succeeded. To route enquiries directly to your live inbox at{' '}
                    <strong>{submitResult.destination}</strong>, obtain a free Web3Forms access key at{' '}
                    <a
                      href="https://web3forms.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-[#A2644B]"
                    >
                      web3forms.com
                    </a>{' '}
                    and add <code className="bg-stone-200 px-1 py-0.5 text-[11px]">VITE_WEB3FORMS_ACCESS_KEY</code> to your environment file.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-4 text-left max-w-lg mx-auto text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Live Transmission Delivered</span>
                  </div>
                  <p>Enquiry delivered live to {submitResult.destination}. Our design team will respond within 24 hours.</p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors"
                >
                  Return to Portfolio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Product preview snippet if single product */}
              {product && (
                <div className="flex items-center gap-4 p-3 bg-white border border-[#E8DED0]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
                      {product.category} • SKU: {product.sku}
                    </div>
                    <div className="font-serif text-base text-stone-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-stone-500 truncate">
                      {product.material}
                    </div>
                  </div>
                </div>
              )}

              {/* Shortlist summary preview */}
              {shortlist && shortlist.length > 0 && !product && (
                <div className="p-3.5 bg-white border border-[#E8DED0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans tracking-wide text-stone-700">
                    <span className="font-semibold text-stone-900">
                      Curated Shortlist ({shortlist.length} Items)
                    </span>
                    <span className="text-[11px] text-[#A2644B]">
                      Direct to {ENQUIRY_CONFIG.destinationEmail}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {shortlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-[#F4EFE6] px-2.5 py-1 text-xs text-stone-800 shrink-0"
                      >
                        <img
                          src={item.images[0]}
                          alt=""
                          className="w-6 h-6 object-cover"
                        />
                        <span className="truncate max-w-[120px]">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination badge */}
              <div className="flex items-center justify-between text-[11px] font-sans tracking-wide bg-[#F4EFE6]/80 px-3.5 py-2 border-l-2 border-[#C5A880] text-stone-700">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>
                    Enquiry destination: <strong className="text-stone-900">{ENQUIRY_CONFIG.destinationEmail}</strong>
                  </span>
                </div>
                <span className="text-stone-500 hidden sm:inline">Concierge Support</span>
              </div>

              {/* Error Alert */}
              {submitResult && !submitResult.success && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitResult.error}</span>
                </div>
              )}

              {/* Bot Honeypot field (hidden from human users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="botField">Leave this field blank</label>
                <input
                  type="text"
                  id="botField"
                  name="botField"
                  value={formData.botField}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Grid 2 Columns: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                  >
                    Full Name <span className="text-[#A2644B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Katherine Sterling"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                      formErrors.fullName ? 'border-rose-400 ring-1 ring-rose-200' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans transition-colors`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-[11px] text-rose-600 font-sans">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                  >
                    Email Address <span className="text-[#A2644B]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. katherine@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                      formErrors.email ? 'border-rose-400 ring-1 ring-rose-200' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans transition-colors`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-[11px] text-rose-600 font-sans">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Grid 2 Columns: Phone Number & Enquiry Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                  >
                    Phone Number <span className="text-stone-400 text-[10px] normal-case">(for WhatsApp concierge)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98112 00000"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                      formErrors.phone ? 'border-rose-400 ring-1 ring-rose-200' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans transition-colors`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-[11px] text-rose-600 font-sans">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="enquiryType"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                  >
                    Enquiry Type
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans transition-colors"
                  >
                    <option value="Product Availability & Bespoke Enquiry">Product Availability & Sizing</option>
                    <option value="Custom Bespoke Dimensions">Custom Bespoke Dimensions</option>
                    <option value="Fabric Swatch Sample Request">Fabric Swatch Sample Request</option>
                    <option value="Interior Design / Trade Project">Interior Design / Trade Project</option>
                    <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                    <option value="Curated Shortlist Consultation">Curated Shortlist Consultation</option>
                  </select>
                </div>
              </div>

              {/* Product Name (Automatically Populated) */}
              <div>
                <label
                  htmlFor="productName"
                  className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                >
                  Product Name / Subject <span className="text-stone-400 text-[10px] normal-case">(Automatically Populated)</span>
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-100 border border-[#E8DED0] text-stone-800 font-sans cursor-default"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
                >
                  Message <span className="text-[#A2644B]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please specify room dimensions, fabric preferences, quantity, or specific questions..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                    formErrors.message ? 'border-rose-400 ring-1 ring-rose-200' : 'border-[#E8DED0]'
                  } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans transition-colors leading-relaxed`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-[11px] text-rose-600 font-sans">
                    {formErrors.message}
                  </p>
                )}
              </div>

              {/* Form Action Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
                <div className="text-[11px] font-sans text-stone-500">
                  Direct submission to <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-5 py-3 border border-stone-300 text-stone-700 text-xs font-sans uppercase tracking-widest hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
