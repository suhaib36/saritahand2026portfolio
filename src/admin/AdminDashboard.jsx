import React, { useState } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminOverview from './views/AdminOverview';
import AdminProducts from './views/AdminProducts';
import AdminCategories from './views/AdminCategories';
import AdminCollections from './views/AdminCollections';
import AdminEnquiries from './views/AdminEnquiries';
import AdminSettings from './views/AdminSettings';

export default function AdminDashboard({ onNavigateHome }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-[#C5A880] rounded-full animate-spin" />
        <div className="font-serif text-lg text-stone-800 tracking-wider">
          Sarita Handa Portal
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onReturnHome={onNavigateHome} />;
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSelectSection={setActiveSection}
      onNavigateHome={onNavigateHome}
      newEnquiriesCount={newEnquiriesCount}
    >
      {activeSection === 'overview' && (
        <AdminOverview
          onNavigateSection={setActiveSection}
          onAddNewProduct={() => setActiveSection('products')}
        />
      )}

      {activeSection === 'products' && (
        <AdminProducts />
      )}

      {activeSection === 'categories' && (
        <AdminCategories />
      )}

      {activeSection === 'collections' && (
        <AdminCollections />
      )}

      {activeSection === 'enquiries' && (
        <AdminEnquiries onEnquiriesCountChange={setNewEnquiriesCount} />
      )}

      {activeSection === 'settings' && (
        <AdminSettings />
      )}
    </AdminLayout>
  );
}
