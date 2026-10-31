import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Upload,
} from 'lucide-react';
import {
  adminGetAllCollections,
  adminCreateCollection,
  adminUpdateCollection,
  adminDeleteCollection,
  adminUploadProductImage,
} from '../../services/catalogService';

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    year: '',
    description: '',
    quote: '',
    banner_image: '',
    is_featured: false,
    is_published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCollections = async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const data = await adminGetAllCollections();
      setCollections(data);
    } catch (err) {
      setErrorNotice(err.message || 'Error loading collections.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      year: 'Autumn / Winter 2026',
      description: '',
      quote: '',
      banner_image: '',
      is_featured: true,
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection(col);
    setFormData({
      name: col.name || '',
      slug: col.slug || '',
      tagline: col.tagline || '',
      year: col.year || '',
      description: col.description || '',
      quote: col.quote || '',
      banner_image: col.banner_image || '',
      is_featured: Boolean(col.is_featured),
      is_published: col.is_published ?? true,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await adminUploadProductImage(file);
      setFormData((prev) => ({ ...prev, banner_image: url }));
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
      if (editingCollection) {
        const updated = await adminUpdateCollection(editingCollection.id, formData);
        setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await adminCreateCollection(formData);
        setCollections((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(`Failed to save collection: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCollection(deleteTarget.id);
      setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleTogglePublish = async (col) => {
    try {
      const updated = await adminUpdateCollection(col.id, {
        ...col,
        is_published: !col.is_published,
      });
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (col) => {
    try {
      const updated = await adminUpdateCollection(col.id, {
        ...col,
        is_featured: !col.is_featured,
      });
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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
            Design Themes
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal">
            Collection Management ({collections.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCollections}
            disabled={isLoading}
            className="p-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-white transition-colors"
            title="Reload collections"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Collection</span>
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

      {/* Grid of Collections */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-sans text-stone-500">
          Loading collections from Supabase...
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white p-16 border border-[#E8DED0] text-center space-y-3">
          <Sparkles className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-serif text-lg text-stone-700">No collections found in Supabase.</p>
          <p className="text-xs text-stone-500">You can seed initial collections from the Settings tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-[#E8DED0] shadow-2xs hover:border-[#C5A880] transition-colors flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img
                    src={col.banner_image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600'}
                    alt={col.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                        col.is_published ? 'bg-[#1C1917]/90 text-white' : 'bg-stone-500/90 text-white'
                      }`}
                    >
                      {col.is_published ? 'Published' : 'Draft'}
                    </span>
                    {col.is_featured && (
                      <span className="bg-[#A2644B] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#A2644B]">
                    <span>{col.tagline || 'Signature Line'}</span>
                    <span>{col.year}</span>
                  </div>
                  <h3 className="font-serif text-xl text-stone-900">{col.name}</h3>
                  {col.quote && (
                    <blockquote className="italic font-serif text-stone-400 text-xs border-l-2 border-[#C5A880] pl-2">
                      "{col.quote}"
                    </blockquote>
                  )}
                  <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed pt-1">
                    {col.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(col)}
                    className="flex items-center gap-1 text-stone-600 hover:text-stone-900 text-[11px] uppercase tracking-wider font-medium"
                  >
                    {col.is_published ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
                    <span>{col.is_published ? 'Live' : 'Draft'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(col)}
                    className={`p-1 ${col.is_featured ? 'text-[#C5A880]' : 'text-stone-400 hover:text-stone-700'}`}
                    title={col.is_featured ? 'Remove from Featured' : 'Feature on Homepage'}
                  >
                    <Star className={`w-3.5 h-3.5 ${col.is_featured ? 'fill-[#C5A880]' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                    title="Edit Collection"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(col)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Collection Modal */}
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
                {editingCollection ? `Edit: ${editingCollection.name}` : 'Create New Collection'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Collection Title <span className="text-[#A2644B]">*</span>
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
                      slug: !editingCollection ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Fine Needlepoint & Monogram"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                    Season / Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. Autumn / Winter 2026"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Poetic Quote / Inscription
                </label>
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="e.g. A quiet dialogue between French romanticism and Indian craft."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Collection Narrative / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Inspiration, embroidery details, and palette..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Banner Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.banner_image}
                    onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8DED0] focus:outline-hidden text-stone-900"
                  />
                  <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-xs font-sans uppercase tracking-wider cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs uppercase font-sans tracking-wider text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-3.5 h-3.5 accent-[#1C1917]"
                    />
                    <span>Publish</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs uppercase font-sans tracking-wider text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-3.5 h-3.5 accent-[#A2644B]"
                    />
                    <span>Feature</span>
                  </label>
                </div>

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
            <h3 className="font-serif text-xl text-stone-900">Delete Collection?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-stone-900">"{deleteTarget.name}"</strong>?
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
