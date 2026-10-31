import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Upload,
} from 'lucide-react';
import {
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminUploadProductImage,
} from '../../services/catalogService';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    image: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const data = await adminGetAllCategories();
      setCategories(data);
    } catch (err) {
      setErrorNotice(err.message || 'Error loading categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      image: '',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      tagline: cat.tagline || '',
      description: cat.description || '',
      image: cat.image || '',
      is_active: cat.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await adminUploadProductImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await adminUpdateCategory(editingCategory.id, formData);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await adminCreateCategory(formData);
        setCategories((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(`Failed to save category: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const updated = await adminUpdateCategory(cat.id, {
        ...cat,
        is_active: !cat.is_active,
      });
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DED0]">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A2644B]">
            Portfolio Organization
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal">
            Category Management ({categories.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            disabled={isLoading}
            className="p-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Reload categories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
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

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-sans text-stone-500">
          Loading categories from Supabase...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-16 border border-[#E8DED0] text-center space-y-3">
          <FolderTree className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-serif text-lg text-stone-700">No categories found in Supabase.</p>
          <p className="text-xs text-stone-500">Seed the initial catalogue from the Settings tab to import all 9 standard categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E8DED0] shadow-2xs hover:border-[#C5A880] transition-colors flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                      cat.is_active ? 'bg-emerald-800/90 text-white' : 'bg-stone-800/90 text-stone-300'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
                    {cat.tagline || 'Portfolio Section'}
                  </div>
                  <h3 className="font-serif text-xl text-stone-900">{cat.name}</h3>
                  <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-[11px] uppercase tracking-wider font-medium"
                >
                  {cat.is_active ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FAF8F5] border border-[#C5A880]/50 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1C1917] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-normal">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Category Name <span className="text-[#A2644B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: !editingCategory ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Signature Needlework & French Knots"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial description of the category..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Category Image URL or Upload
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                  />
                  <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-xs font-sans uppercase tracking-wider cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 accent-[#1C1917]"
                  />
                  <span className="text-xs uppercase font-sans tracking-wider text-stone-800">
                    Visible on Website
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-xs font-sans uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#1C1917] text-white text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917]"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md bg-white p-6 space-y-4 border border-stone-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-stone-900">Delete Category?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-stone-900">"{deleteTarget.name}"</strong>? Products in this category will become unassigned.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-stone-300 text-xs uppercase font-sans tracking-wider text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-rose-600 text-white text-xs uppercase font-sans tracking-widest hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
