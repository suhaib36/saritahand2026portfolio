import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import ShortlistDrawer from './components/ShortlistDrawer';
import QuickSearchModal from './components/QuickSearchModal';
import Toast from './components/Toast';

import HomeView from './views/HomeView';
import CatalogueView from './views/CatalogueView';
import ProductDetailView from './views/ProductDetailView';
import CollectionsView from './views/CollectionsView';
import CraftsmanshipView from './views/CraftsmanshipView';
import ContactView from './views/ContactView';

import { PRODUCTS_DATA } from './data/productsData';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalogueFilters, setCatalogueFilters] = useState({});

  // Modals & Drawers state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryTargetProduct, setEnquiryTargetProduct] = useState(null);
  const [enquiryTargetShortlist, setEnquiryTargetShortlist] = useState(null);

  const [shortlistDrawerOpen, setShortlistDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Shortlist state persisted in localStorage
  const [shortlist, setShortlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sarita_handa_shortlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sarita_handa_shortlist', JSON.stringify(shortlist));
    } catch {
      // ignore
    }
  }, [shortlist]);

  // Dynamic document title
  useEffect(() => {
    const titles = {
      home: 'Sarita Handa | Luxury Home Furnishings & Bespoke Textiles',
      catalogue: 'Portfolio Catalogue | Sarita Handa Handcrafted Linens & Furniture',
      'product-detail': selectedProduct
        ? `${selectedProduct.name} | Sarita Handa`
        : 'Product Details | Sarita Handa',
      collections: 'Signature Collections Lookbook | Sarita Handa',
      about: 'The Art of the Needle & Heritage Craftsmanship | Sarita Handa',
      contact: 'Flagship Showrooms & Client Concierge | Sarita Handa',
    };
    document.title = titles[currentView] || 'Sarita Handa | Luxury Living';
  }, [currentView, selectedProduct]);

  // Scroll to top on view change
  const navigateTo = (view, param = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'product-detail' && param) {
      setSelectedProduct(param);
      setCurrentView('product-detail');
      return;
    }

    if (view === 'catalogue') {
      if (param) {
        setCatalogueFilters(param);
      } else {
        setCatalogueFilters({});
      }
      setCurrentView('catalogue');
      return;
    }

    setCurrentView(view);
  };

  // Toast helper
  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  // Shortlist handlers
  const handleToggleShortlist = (product) => {
    setShortlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast({
          type: 'info',
          message: `Removed "${product.name}" from your shortlist.`,
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast({
          type: 'success',
          message: `Added "${product.name}" to your curated shortlist.`,
        });
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromShortlist = (productId) => {
    setShortlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearShortlist = () => {
    setShortlist([]);
    showToast({
      type: 'info',
      message: 'Shortlist cleared.',
    });
  };

  // Enquiry Modal triggers
  const handleOpenProductEnquiry = (product) => {
    setEnquiryTargetProduct(product);
    setEnquiryTargetShortlist(null);
    setEnquiryModalOpen(true);
  };

  const handleOpenShortlistEnquiry = (shortlistItems) => {
    setEnquiryTargetProduct(null);
    setEnquiryTargetShortlist(shortlistItems);
    setEnquiryModalOpen(true);
  };

  const handleOpenGeneralEnquiry = () => {
    setEnquiryTargetProduct(null);
    setEnquiryTargetShortlist(null);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#C5A880]/30 selection:text-stone-900 font-sans">
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setShortlistDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenEnquiry={handleOpenGeneralEnquiry}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onViewProduct={(p) => navigateTo('product-detail', p)}
            onEnquireProduct={handleOpenProductEnquiry}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
          />
        )}

        {currentView === 'catalogue' && (
          <CatalogueView
            initialFilters={catalogueFilters}
            onNavigate={navigateTo}
            onViewProduct={(p) => navigateTo('product-detail', p)}
            onEnquireProduct={handleOpenProductEnquiry}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct || PRODUCTS_DATA[0]}
            onNavigate={navigateTo}
            onViewProduct={(p) => navigateTo('product-detail', p)}
            onEnquireProduct={handleOpenProductEnquiry}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
            onShowToast={showToast}
          />
        )}

        {currentView === 'collections' && (
          <CollectionsView
            onNavigate={navigateTo}
            onEnquire={(item) => handleOpenProductEnquiry(item)}
          />
        )}

        {currentView === 'about' && (
          <CraftsmanshipView
            onNavigate={navigateTo}
            onEnquire={(item) => handleOpenProductEnquiry(item)}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            onNavigate={navigateTo}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Luxury Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenEnquiry={handleOpenGeneralEnquiry}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={enquiryTargetProduct}
        shortlist={enquiryTargetShortlist}
      />

      {/* Curated Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={shortlistDrawerOpen}
        onClose={() => setShortlistDrawerOpen(false)}
        shortlist={shortlist}
        onRemoveItem={handleRemoveFromShortlist}
        onClearAll={handleClearShortlist}
        onViewProduct={(p) => navigateTo('product-detail', p)}
        onEnquireAll={handleOpenShortlistEnquiry}
      />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={PRODUCTS_DATA}
        onSelectProduct={(p) => navigateTo('product-detail', p)}
        onViewAllResults={(query) => navigateTo('catalogue', { query })}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
