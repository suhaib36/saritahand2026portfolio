import React, { useEffect } from 'react';
import { Check, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in-up">
      <div className="flex items-center gap-3 bg-[#1C1917] text-[#FAF8F5] px-5 py-3.5 shadow-2xl border border-[#C5A880]/30 rounded-none">
        {toast.type === 'info' ? (
          <Info className="w-4 h-4 text-[#C5A880] shrink-0" />
        ) : (
          <Check className="w-4 h-4 text-[#C5A880] shrink-0" />
        )}
        <div className="text-xs font-sans tracking-wide pr-2">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-stone-400 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
