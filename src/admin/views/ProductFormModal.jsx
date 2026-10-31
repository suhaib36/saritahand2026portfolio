import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Plus,
  Image,
  AlertCircle,
  Save,
  Check,
  Star,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { adminUploadProductImage } from '../../services/catalogService';

export default function ProductFormModal({
  isOpen,
  onClose,
  product = null,
  categories = [],
  collections = [],
  onSave,
}) {
  const isEditMode = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    badge: '',
    price: '',
    category: '',
    categoryId: '',
    collection: '',
    collectionId: '',
    shortDescription: '',
    fullDescription: '',
    story: '',
    material: '',
    primaryColor: '',
    dimensions: '',
    technique: '',
    care: '',
    leadTime: '',
    featured: false,
    isPublished: true,
    images: [],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        badge: product.badge || '',
        price: product.price !== null && product.price !== undefined ? String(product.price) : '',
        category: product.category || categories[0]?.name || '',
        categoryId: product.categoryId || categories[0]?.id || '',
        collection: product.collection || '',
        collectionId: product.collectionId || '',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        story: product.story || '',
        material: product.material || '',
        primaryColor: product.primaryColor || '',
        dimensions: product.dimensions || '',
        technique: product.technique || '',
        care: product.care || '',
        leadTime: product.leadTime || '',
        featured: Boolean(product.featured),
        isPublished: product.isPublished !== undefined ? Boolean(product.isPublished) : true,
        images: Array.isArray(product.images) ? [...product.images] : [],
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        sku: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
        badge: 'New Creation',
        price: '',
        category: categories[0]?.name || 'Cushions',
        categoryId: categories[0]?.id || '',
        collection: collections[0]?.name || '',
        collectionId: collections[0]?.id || '',
        shortDescription: '',
        fullDescription: '',
        story: '',
        material: '100% Belgian Flax Linen',
        primaryColor: 'Warm Alabaster',
        dimensions: '50 cm x 50 cm (20" x 20")',
        technique: 'Hand-worked French Knot Embroidery',
        care: 'Dry Clean Only.',
        leadTime: 'In stock. Ready to ship in 3-5 days.',
        featured: false,
        isPublished: true,
        images: [],
      });
    }

    setValidationErrors({});
    setUploadError(null);
  }, [isOpen, product, categories, collections]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'name' && !isEditMode) {
      // Auto-generate slug
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }

    if (name === 'category') {
      const selectedCat = categories.find((c) => c.name === value);
      if (selectedCat) {
        setFormData((prev) => ({ ...prev, categoryId: selectedCat.id || selectedCat.slug }));
      }
    }

    if (name === 'collection') {
      const selectedCol = collections.find((c) => c.name === value);
      if (selectedCol) {
        setFormData((prev) => ({ ...prev, collectionId: selectedCol.id || selectedCol.slug }));
      }
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const publicUrl = await adminUploadProductImage(file);
        uploadedUrls.push(publicUrl);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      setUploadError(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddDirectImageUrl = () => {
    const url = prompt('Enter public image URL:');
    if (url && url.trim().startsWith('http')) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url.trim()],
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleMoveImageToCover = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const imagesCopy = [...prev.images];
      const [selected] = imagesCopy.splice(index, 1);
      imagesCopy.unshift(selected);
      return { ...prev, images: imagesCopy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Product name is required.';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
    if (formData.images.length === 0) errors.images = 'At least one product image is required.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        id: product?.id,
      });
      onClose();
    } catch (err) {
      setUploadError(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#C5A880]/50 shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1C1917] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#C5A880]/30">
          <div>
            <div className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#C5A880]">
              Product Portfolio Management
            </div>
            <h2 className="font-serif text-2xl text-white font-normal">
              {isEditMode ? `Edit: ${product.name}` : 'Add New Luxury Creation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {uploadError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 border border-[#E8DED0] space-y-4">
            <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
              1. General Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Product Name <span className="text-[#A2644B]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Samarkand Suzani Embroidered Lumbar"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. samarkand-suzani-lumbar"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Category <span className="text-[#A2644B]">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Collection
                </label>
                <select
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                >
                  <option value="">None / Signature General</option>
                  {collections.map((col) => (
                    <option key={col.id || col.name} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  SKU Reference
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SH-CSH-0101"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Badge Tag (Optional)
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="e.g. Signature Embroidery, New Arrival, Bespoke"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Price (Optional Numeric or Custom)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Leave blank for 'Price on Request'"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product Images (Supabase Storage) */}
          <div className="bg-white p-6 border border-[#E8DED0] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-serif text-lg text-stone-900">
                  2. Product Images ({formData.images.length})
                </h3>
                <p className="text-[11px] text-stone-500 font-sans">
                  The first image serves as the main catalogue cover. Click "Set Cover" on any thumbnail to reorder.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDirectImageUrl}
                className="text-xs uppercase font-sans tracking-wider text-[#A2644B] hover:underline"
              >
                + Add Image URL
              </button>
            </div>

            {validationErrors.images && (
              <p className="text-[11px] text-rose-600">{validationErrors.images}</p>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#E8DED0] p-6 text-center bg-[#FAF8F5] hover:border-[#C5A880] transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="space-y-2 pointer-events-none">
                <Upload className="w-8 h-8 mx-auto text-[#A2644B]" />
                <div className="text-xs font-sans text-stone-800">
                  {uploadingImage ? (
                    <span className="text-[#A2644B] font-medium">Uploading to Supabase Storage...</span>
                  ) : (
                    <span>Click or drag and drop high-resolution product photographs</span>
                  )}
                </div>
                <div className="text-[10px] text-stone-400">JPG, PNG, WEBP up to 10MB each</div>
              </div>
            </div>

            {/* Thumbnails Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square bg-stone-100 border border-stone-200 overflow-hidden"
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#1C1917] text-white text-[8px] uppercase tracking-wider px-1.5 py-0.5">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 text-white">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImageToCover(idx)}
                          className="text-[9px] uppercase tracking-wider underline hover:text-[#C5A880]"
                        >
                          Set Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-rose-300 hover:text-rose-100 p-1"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Descriptions & Storytelling */}
          <div className="bg-white p-6 border border-[#E8DED0] space-y-4">
            <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
              3. Editorial Description & Story
            </h3>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                Short Description (Card summary) <span className="text-[#A2644B]">*</span>
              </label>
              <textarea
                name="shortDescription"
                required
                rows={2}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="2-line summary displayed on product cards..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 leading-relaxed"
              />
              {validationErrors.shortDescription && (
                <p className="mt-1 text-[11px] text-rose-600">{validationErrors.shortDescription}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                Full Editorial Description
              </label>
              <textarea
                name="fullDescription"
                rows={4}
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Detailed description for the product page..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                Craftsmanship Story (Heritage context)
              </label>
              <textarea
                name="story"
                rows={2}
                value={formData.story}
                onChange={handleChange}
                placeholder="Background on the artisans, stitches, or historical inspiration..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Specifications & Care */}
          <div className="bg-white p-6 border border-[#E8DED0] space-y-4">
            <h3 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2">
              4. Materials, Dimensions & Care
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. 100% Pure European Flax Linen"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Primary Colour
                </label>
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  placeholder="e.g. Warm Alabaster, Terracotta"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="e.g. 50 cm x 50 cm"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Technique
                </label>
                <input
                  type="text"
                  name="technique"
                  value={formData.technique}
                  onChange={handleChange}
                  placeholder="e.g. Aari Chain Stitch Needlework"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Care Instructions
                </label>
                <input
                  type="text"
                  name="care"
                  value={formData.care}
                  onChange={handleChange}
                  placeholder="e.g. Professional Dry Clean Only"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-widest text-stone-700 mb-1">
                  Lead Time
                </label>
                <input
                  type="text"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleChange}
                  placeholder="e.g. Ships in 3-5 days"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E8DED0] focus:outline-hidden focus:border-[#C5A880] text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Publishing Status & Features */}
          <div className="bg-white p-6 border border-[#E8DED0] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#1C1917]"
                />
                <span className="text-xs font-sans uppercase tracking-wider text-stone-800 font-medium">
                  Publish to Website
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#A2644B]"
                />
                <span className="text-xs font-sans uppercase tracking-wider text-stone-800 font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />
                  <span>Feature on Homepage</span>
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-sans uppercase tracking-wider hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-sans uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1C1917] transition-all disabled:opacity-60 shadow-md"
              >
                {isSubmitting ? (
                  <span>Saving to Supabase...</span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
