import React from 'react';
import { X, Trash2, Mail, ExternalLink, Bookmark } from 'lucide-react';
import { ENQUIRY_CONFIG } from '../config/enquiryConfig';

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlist,
  onRemoveItem,
  onClearAll,
  onViewProduct,
  onEnquireAll,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#C5A880]/40 overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#1C1917] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A880]/30">
          <div>
            <div className="text-[10px] font-sans uppercase tracking-luxury text-[#C5A880]">
              Personal Lookbook
            </div>
            <h2 className="font-serif text-2xl tracking-wide font-normal">
              Curated Shortlist ({shortlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Close shortlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {shortlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#E8DED0]/60 flex items-center justify-center text-stone-500">
                <Bookmark className="w-6 h-6 stroke-1" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-stone-900 mb-1">
                  Your Shortlist is Empty
                </h3>
                <p className="text-xs font-sans text-stone-500 max-w-xs leading-relaxed">
                  As you explore our collections, click the bookmark icon on any cushion, quilt, drape, or furniture piece to curate your private lookbook.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs font-sans text-stone-500">
                <span>Selected Pieces</span>
                <button
                  onClick={onClearAll}
                  className="hover:text-rose-600 transition-colors uppercase tracking-wider text-[10px]"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {shortlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 bg-white border border-[#E8DED0] hover:border-[#C5A880]/60 transition-colors group"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-sans tracking-widest text-[#A2644B]">
                          {item.category}
                        </div>
                        <h4
                          onClick={() => {
                            onViewProduct(item);
                            onClose();
                          }}
                          className="font-serif text-base text-stone-900 truncate hover:text-[#A2644B] cursor-pointer transition-colors"
                        >
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 truncate">
                          {item.material}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <button
                          onClick={() => {
                            onViewProduct(item);
                            onClose();
                          }}
                          className="flex items-center gap-1 text-stone-700 hover:text-[#A2644B] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {shortlist.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8DED0] space-y-3">
            <div className="text-[11px] text-stone-500 text-center">
              All enquiries delivered to <strong>{ENQUIRY_CONFIG.destinationEmail}</strong>
            </div>
            <button
              onClick={() => {
                onEnquireAll(shortlist);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Enquire About Entire Shortlist ({shortlist.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
