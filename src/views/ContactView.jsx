import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Globe,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, PinterestIcon } from '../components/SocialIcons';
import Breadcrumb from '../components/Breadcrumb';
import { BRAND_DATA } from '../data/brandData';
import { submitEnquiry } from '../services/enquiryService';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function ContactView({ onNavigate, onShowToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: 'General Consultation',
    message: '',
    botField: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

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
        productName: `General Contact Enquiry: ${formData.enquiryType}`,
        category: 'Contact Page Submission',
      });

      if (response.success) {
        setSubmitResult({
          success: true,
          simulated: response.simulated,
          destination: response.destination,
          message: response.message,
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
        error: 'An unexpected error occurred while transmitting your message.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumb
        items={[{ label: 'Contact & Flagship Boutiques' }]}
        onNavigate={onNavigate}
      />

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
          Client Concierge & Boutiques
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-normal">
          Connect With Our House
        </h1>
        <div className="w-12 h-0.5 bg-[#C5A880] mx-auto my-2" />
        <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
          Whether planning a private residence, seeking custom textile dimensions, or booking an appointment at our flagship showrooms, our concierge team is delighted to assist.
        </p>
      </div>

      {/* Main Grid: Contact Form + Concierge Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: General Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-[#E8DED0] shadow-sm">
          <div className="space-y-2 mb-6">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
              Direct Inquiry
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Send an Enquiry
            </h2>
            <div className="text-xs font-sans text-stone-500">
              All messages are routed directly to <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>.
            </div>
          </div>

          {submitResult && submitResult.success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">
                Message Received, {formData.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting Sarita Handa. Your enquiry has been registered for delivery to{' '}
                <strong>{submitResult.destination}</strong>. A design consultant will be in touch shortly.
              </p>

              {submitResult.simulated && (
                <div className="bg-[#FAF8F5] border border-[#C5A880]/40 p-4 text-left max-w-md mx-auto text-xs text-stone-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-stone-900">
                    <Info className="w-4 h-4 text-[#A2644B]" />
                    <span>Configuration Note</span>
                  </div>
                  <p className="leading-relaxed">
                    Form validation completed. To route submissions live to your inbox at{' '}
                    <strong>{submitResult.destination}</strong>, enter your free Web3Forms key in <code className="bg-stone-200 px-1 py-0.5 text-[10px]">VITE_WEB3FORMS_ACCESS_KEY</code>.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setSubmitResult(null);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    enquiryType: 'General Consultation',
                    message: '',
                    botField: '',
                  });
                }}
                className="mt-4 px-6 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {submitResult && !submitResult.success && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitResult.error}</span>
                </div>
              )}

              {/* Bot Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contactBotField">Leave blank</label>
                <input
                  type="text"
                  id="contactBotField"
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
                    htmlFor="contactFullName"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1"
                  >
                    Full Name <span className="text-[#A2644B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactFullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border ${
                      formErrors.fullName ? 'border-rose-400' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-[10px] text-rose-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1"
                  >
                    Email Address <span className="text-[#A2644B]">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. eleanor@residence.com"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border ${
                      formErrors.email ? 'border-rose-400' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-[10px] text-rose-600">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Grid 2 Columns: Phone & Enquiry Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98112 00000"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border ${
                      formErrors.phone ? 'border-rose-400' : 'border-[#E8DED0]'
                    } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-[10px] text-rose-600">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contactType"
                    className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1"
                  >
                    Subject / Project Nature
                  </label>
                  <select
                    id="contactType"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans"
                  >
                    <option value="General Consultation">General Consultation</option>
                    <option value="Residential Interior Project">Residential Interior Project</option>
                    <option value="Bespoke Sizing & Swatches">Bespoke Sizing & Swatches</option>
                    <option value="Trade & Hospitality Commission">Trade & Hospitality Commission</option>
                    <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contactMessage"
                  className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1"
                >
                  Message / Requirements <span className="text-[#A2644B]">*</span>
                </label>
                <textarea
                  id="contactMessage"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please detail your interior project requirements, products of interest, or custom specifications..."
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border ${
                    formErrors.message ? 'border-rose-400' : 'border-[#E8DED0]'
                  } focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans leading-relaxed`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-[10px] text-rose-600">{formErrors.message}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-stone-500">
                  Target Destination: <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Direct Concierge & Showrooms */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Concierge Card */}
          <div className="bg-[#1C1917] text-[#FAF8F5] p-6 sm:p-8 border border-[#C5A880]/40 space-y-4">
            <span className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880]">
              Headquarters Concierge
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">
              Direct Contact Details
            </h3>

            <div className="space-y-3 text-xs font-sans text-stone-300 pt-1">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href={`mailto:${ENQUIRY_CONFIG.destinationEmail}`}
                  className="hover:underline truncate text-white"
                >
                  {ENQUIRY_CONFIG.destinationEmail}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={`tel:${ENQUIRY_CONFIG.conciergePhone}`} className="hover:underline">
                  {ENQUIRY_CONFIG.conciergePhone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{ENQUIRY_CONFIG.conciergeHours}</span>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{BRAND_DATA.contact.corporateAddress}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <div className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880]">
                Follow Our Stories
              </div>
              <div className="flex items-center gap-4 text-xs font-sans text-stone-400">
                <a
                  href={BRAND_DATA.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={BRAND_DATA.contact.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <PinterestIcon className="w-3.5 h-3.5" />
                  <span>Pinterest</span>
                </a>
                <a
                  href={BRAND_DATA.contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trade / Hospitality Card */}
          <div className="bg-[#F4EFE6] p-6 border border-[#E8DED0] space-y-3">
            <h4 className="font-serif text-xl text-stone-900">
              Interior Designers & Architects
            </h4>
            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              We collaborate closely with leading interior design studios and architectural practices. Register your trade credentials to access bespoke textile sourcing and trade pricing.
            </p>
            <div className="text-xs font-sans text-[#A2644B] font-medium">
              Direct enquiries: {ENQUIRY_CONFIG.destinationEmail}
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Showrooms Directory */}
      <section className="space-y-8 pt-8 border-t border-[#E8DED0]">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Boutique Locations
          </span>
          <h2 className="font-serif text-3xl text-stone-900 font-normal">
            Visit Our Showrooms
          </h2>
          <p className="text-xs font-sans text-stone-600">
            Immerse yourself in our textile archives and experience our handcrafted furniture first hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_DATA.showrooms.map((showroom, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8DED0] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                <img
                  src={showroom.image}
                  alt={showroom.name}
                  className="w-full h-full object-cover"
                />
                {showroom.isFlagship && (
                  <span className="absolute top-3 left-3 bg-[#1C1917]/90 text-white text-[9px] uppercase font-sans tracking-widest px-2.5 py-1">
                    Flagship
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
                    {showroom.city}
                  </div>
                  <h3 className="font-serif text-lg text-stone-900 leading-snug">
                    {showroom.name}
                  </h3>
                  <p className="text-xs font-sans text-stone-500 pt-1 leading-relaxed">
                    {showroom.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs font-sans text-stone-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#A2644B]" />
                    <span>{showroom.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                    <Clock className="w-3 h-3 text-[#A2644B]" />
                    <span>{showroom.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
