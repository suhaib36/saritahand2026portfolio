import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';

export default function AdminLogin({ onReturnHome }) {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setErrorMessage(
        err.message?.includes('Invalid login credentials')
          ? 'Invalid email or password. Please verify your administrator credentials.'
          : err.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#C5A880]/30 selection:text-stone-900 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <button
            onClick={onReturnHome}
            className="inline-flex items-center gap-1.5 text-xs uppercase font-sans tracking-widest text-stone-500 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] text-stone-900 uppercase font-normal">
            Sarita Handa
          </h1>
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#A2644B]">
            Management & Concierge Portal
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white border border-[#E8DED0] shadow-xl p-8 sm:p-10">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-stone-100 text-stone-800">
            <Lock className="w-4 h-4 text-[#A2644B]" />
            <h2 className="font-serif text-lg text-stone-900">Administrator Sign In</h2>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="adminEmail"
                className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="adminEmail"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saritahanda.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="adminPassword"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-[0.2em] font-medium hover:bg-[#C5A880] hover:text-[#1C1917] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center gap-2 text-[11px] font-sans text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5E6B5D] shrink-0" />
            <span>Encrypted Supabase Auth session. Public registration disabled.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
