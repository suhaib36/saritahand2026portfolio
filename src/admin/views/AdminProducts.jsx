import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetAllCategories,
  adminGetAllCollections,
} from '../../services/catalogService';

export default function AdminProducts({ onOpenProductPreview }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'published' | 'draft' | 'featured'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'name-desc'

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const [prods, cats, cols] = await Promise.all([
        adminGetAllProducts(),
        adminGetAllCategories().catch(() => []),
        adminGetAllCollections().catch(() => []),
      ]);
      setProducts(prods);
      setCategories(cats);
      setCollections(cols);
    } catch (err) {
      setErrorNotice(err.message || 'Error fetching products from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'published' && !p.isPublished) return false;
      if (selectedStatus === 'draft' && p.isPublished) return false;
      if (selectedStatus === 'featured' && !p.featured) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (productData.id) {
      // Edit
      const updated = await adminUpdateProduct(productData.id, productData);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      // Create
      const created = await adminCreateProduct(productData);
      setProducts((prev) => [created, ...prev]);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminDeleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (product) => {
    try {
      const updated = await adminUpdateProduct(product.id, {
        ...product,
        isPublished: !product.isPublished,
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      alert(`Failed to toggle publishing: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED0]">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Product Catalogue
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal">
            Product Management ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Reload products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8DED0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, material..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 font-sans"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="featured">Featured</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E8DED0] text-xs font-sans text-stone-800 focus:outline-hidden"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8DED0] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-sans text-stone-500 space-y-2">
            <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>Loading products from Supabase...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-xs font-sans text-stone-500 space-y-3">
            <Package className="w-8 h-8 mx-auto text-stone-300" />
            <p className="font-serif text-lg text-stone-700">No products match your current filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="px-4 py-2 border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DED0] text-[10px] uppercase tracking-widest text-stone-500">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=100'}
                          alt=""
                          className="w-12 h-12 object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <div className="font-serif text-sm text-stone-900 font-medium truncate max-w-xs">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            SKU: {prod.sku || 'N/A'} • {prod.images?.length || 0} images
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-stone-800">{prod.category}</div>
                      {prod.collection && (
                        <div className="text-[10px] text-[#A2644B] truncate max-w-[120px]">
                          {prod.collection}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {prod.price ? `₹${prod.price.toLocaleString('en-IN')}` : <span className="text-stone-400 italic">On Request</span>}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(prod)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border rounded-none transition-colors ${
                          prod.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                        }`}
                        title="Click to toggle publishing"
                      >
                        {prod.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {prod.featured ? (
                        <Star className="w-4 h-4 text-[#C5A880] fill-[#C5A880] mx-auto" />
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(prod)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        categories={categories}
        collections={collections}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md bg-white border border-stone-300 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-xl text-stone-900">Delete Product?</h3>
            </div>

            <p className="text-xs font-sans text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-stone-900">"{deleteTarget.name}"</strong>? This will permanently remove it from Supabase and the public portfolio.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-stone-300 text-xs uppercase font-sans tracking-wider text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 text-white text-xs uppercase font-sans tracking-widest hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
