import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Sparkles,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';

export default function AdminLayout({
  activeSection = 'overview',
  onSelectSection,
  onNavigateHome,
  newEnquiriesCount = 0,
  children,
}) {
  const { user, signOut } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'collections', label: 'Collections', icon: Sparkles },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: Mail,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (sectionId) => {
    onSelectSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-stone-900 font-sans flex flex-col md:flex-row selection:bg-[#C5A880]/30 selection:text-stone-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#1C1917] text-[#FAF8F5] flex-col border-r border-[#C5A880]/20 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800 space-y-1">
          <div className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A880]">
            Management Portal
          </div>
          <h1 className="font-serif text-2xl tracking-[0.2em] text-white uppercase font-normal">
            Sarita Handa
          </h1>
          <div className="text-[10px] text-stone-400 font-sans">
            Supabase Cloud Connected
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-sans uppercase tracking-wider rounded-none transition-colors ${
                  isActive
                    ? 'bg-[#FAF8F5] text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A2644B]' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#A2644B] text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="px-3 py-2 bg-stone-900 text-xs font-sans text-stone-300 flex items-center gap-2 truncate border border-stone-800">
            <Shield className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span className="truncate text-[11px]">{user?.email || 'Administrator'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center justify-center gap-1.5 py-2 px-2 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-[11px] font-sans uppercase tracking-wider transition-colors"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </button>

            <button
              onClick={signOut}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-stone-800 hover:bg-rose-950 hover:text-rose-200 text-stone-300 text-[11px] font-sans uppercase tracking-wider transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#1C1917] text-white p-4 flex items-center justify-between border-b border-stone-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif text-lg tracking-wider uppercase">Sarita Handa Admin</span>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs uppercase font-sans tracking-widest text-[#C5A880] flex items-center gap-1"
        >
          <span>Site</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1C1917] text-white px-4 py-4 space-y-2 border-b border-stone-800 animate-fade-in-down z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-3 text-xs uppercase font-sans tracking-wider ${
                  isActive ? 'bg-[#FAF8F5] text-stone-900 font-semibold' : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#A2644B] text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-800 flex justify-between items-center text-xs">
            <span className="text-stone-400 text-[11px] truncate">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-rose-300 hover:text-rose-100 uppercase tracking-wider text-[11px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex bg-white border-b border-[#E8DED0] px-8 py-4 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="font-semibold text-stone-900 capitalize">{activeSection}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3 text-[#A2644B]" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
