import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  FileEdit,
  FolderTree,
  Mail,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminGetAllProducts, adminGetAllCategories, adminGetAllEnquiries } from '../../services/catalogService';

export default function AdminOverview({ onNavigateSection, onAddNewProduct }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalCategories: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorNotice(null);

    try {
      // 1. Fetch products
      const products = await adminGetAllProducts().catch((e) => {
        console.warn('Products fetch note:', e.message);
        return [];
      });

      // 2. Fetch categories
      const categories = await adminGetAllCategories().catch(() => []);

      // 3. Fetch enquiries
      const enquiries = await adminGetAllEnquiries().catch(() => []);

      const published = products.filter((p) => p.isPublished).length;
      const drafts = products.filter((p) => !p.isPublished).length;
      const newEnq = enquiries.filter((e) => e.status === 'new').length;

      setStats({
        totalProducts: products.length,
        publishedProducts: published,
        draftProducts: drafts,
        totalCategories: categories.length,
        totalEnquiries: enquiries.length,
        newEnquiries: newEnq,
      });

      setRecentProducts(products.slice(0, 5));
      setRecentEnquiries(enquiries.slice(0, 5));
    } catch (err) {
      setErrorNotice(err.message || 'Error communicating with Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: `${stats.publishedProducts} active on site`,
      icon: Package,
      action: () => onNavigateSection('products'),
      color: 'text-stone-900',
    },
    {
      title: 'Published Products',
      value: stats.publishedProducts,
      subtitle: 'Visible to public visitors',
      icon: Eye,
      action: () => onNavigateSection('products'),
      color: 'text-[#5E6B5D]',
    },
    {
      title: 'Draft Products',
      value: stats.draftProducts,
      subtitle: 'Unpublished or in progress',
      icon: FileEdit,
      action: () => onNavigateSection('products'),
      color: 'text-stone-500',
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      subtitle: 'Organized product lines',
      icon: FolderTree,
      action: () => onNavigateSection('categories'),
      color: 'text-stone-900',
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      subtitle: 'Customer leads received',
      icon: Mail,
      action: () => onNavigateSection('enquiries'),
      color: 'text-[#A2644B]',
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      subtitle: 'Require concierge response',
      icon: AlertCircle,
      action: () => onNavigateSection('enquiries'),
      color: stats.newEnquiries > 0 ? 'text-amber-700 bg-amber-50/50' : 'text-stone-700',
      highlight: stats.newEnquiries > 0,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED0]">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Portfolio Dashboard
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal">
            Overview & Activity
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onAddNewProduct}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => onNavigateSection('enquiries')}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-800 text-stone-900 text-xs font-sans uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>View Enquiries</span>
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => onNavigateSection('settings')}
            className="underline uppercase tracking-wider text-[11px] font-semibold"
          >
            Run Seed / Schema Setup →
          </button>
        </div>
      )}

      {/* 6 Real Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className={`p-5 bg-white border cursor-pointer hover:border-[#C5A880] hover:shadow-md transition-all flex flex-col justify-between ${
                card.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-[#E8DED0]'
              }`}
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 font-semibold truncate">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
              </div>

              <div>
                <div className="font-serif text-3xl font-normal text-stone-900">
                  {isLoading ? '...' : card.value}
                </div>
                <div className="text-[10px] text-stone-500 font-sans truncate mt-1">
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Grid: Recent Enquiries & Recently Added Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Enquiries */}
        <div className="lg:col-span-7 bg-white p-6 border border-[#E8DED0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A2644B]" />
              <h2 className="font-serif text-xl text-stone-900">Recent Customer Enquiries</h2>
            </div>
            <button
              onClick={() => onNavigateSection('enquiries')}
              className="text-xs font-sans uppercase tracking-widest text-[#A2644B] hover:underline flex items-center gap-1"
            >
              <span>All Enquiries</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-500">
              No customer enquiries registered yet. Submissions from the public portfolio will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-400">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Product</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentEnquiries.map((enq) => {
                    const statusColors = {
                      new: 'bg-amber-100 text-amber-800 border-amber-300',
                      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
                      in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
                      completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    };
                    return (
                      <tr
                        key={enq.id}
                        onClick={() => onNavigateSection('enquiries')}
                        className="hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                      >
                        <td className="py-3 pr-2">
                          <div className="font-medium text-stone-900">{enq.customerName}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[150px]">{enq.customerEmail}</div>
                        </td>
                        <td className="py-3 pr-2 truncate max-w-[160px] text-stone-700">
                          {enq.productName}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] uppercase font-semibold tracking-wider border rounded-none ${
                              statusColors[enq.status] || 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {enq.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 text-right text-stone-400 text-[11px] whitespace-nowrap">
                          {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Recently Added Products */}
        <div className="lg:col-span-5 bg-white p-6 border border-[#E8DED0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-800" />
              <h2 className="font-serif text-xl text-stone-900">Recent Products</h2>
            </div>
            <button
              onClick={() => onNavigateSection('products')}
              className="text-xs font-sans uppercase tracking-widest text-[#A2644B] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-500">
              No products found in database. You can seed the initial catalog from the Settings tab.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onNavigateSection('products')}
                  className="py-2.5 flex items-center gap-3.5 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=200&auto=format&fit=crop'}
                    alt={prod.name}
                    className="w-12 h-12 object-cover bg-stone-100 shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-sm text-stone-900 truncate">{prod.name}</div>
                    <div className="text-[10px] uppercase font-sans tracking-wider text-stone-400">
                      {prod.category} • {prod.sku}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                        prod.isPublished ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 bg-stone-100'
                      }`}
                    >
                      {prod.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
