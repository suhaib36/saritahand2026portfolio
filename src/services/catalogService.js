import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS_DATA } from '../data/productsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { COLLECTIONS_DATA } from '../data/collectionsData';

/**
 * Normalizes a database product record into the standard client product shape
 */
export function mapDbProductToClient(db) {
  if (!db) return null;
  return {
    id: db.id,
    dbId: db.id,
    name: db.name,
    slug: db.slug || db.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    sku: db.sku || `SH-${db.id?.slice(0, 4)?.toUpperCase() || 'PROD'}`,
    badge: db.badge || '',
    category: db.category_name || db.category || 'General',
    categoryId: db.category_id || db.categoryId || 'cushions',
    collection: db.collection_name || db.collection || '',
    collectionId: db.collection_id || db.collectionId || '',
    shortDescription: db.short_description || db.shortDescription || '',
    fullDescription: db.description || db.fullDescription || '',
    story: db.story || '',
    price: db.price !== undefined && db.price !== null ? Number(db.price) : null,
    dimensions: db.dimensions || '',
    material: db.material || '',
    technique: db.technique || '',
    care: db.care || '',
    leadTime: db.lead_time || db.leadTime || '',
    colors: Array.isArray(db.colors) ? db.colors : [],
    primaryColor: db.colour || db.primaryColor || (Array.isArray(db.colors) && db.colors[0]?.name) || '',
    images: Array.isArray(db.images) && db.images.length > 0 ? db.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200&auto=format&fit=crop'],
    featured: Boolean(db.is_featured ?? db.featured),
    isPublished: Boolean(db.is_published ?? true),
    isNew: Boolean(db.is_new ?? false),
    specifications: db.specifications && typeof db.specifications === 'object' ? db.specifications : {},
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

/**
 * Normalizes a client product into the database schema shape
 */
export function mapClientProductToDb(client) {
  return {
    name: client.name?.trim(),
    slug: (client.slug || client.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`).trim(),
    sku: client.sku?.trim() || null,
    badge: client.badge?.trim() || null,
    short_description: client.shortDescription?.trim() || '',
    description: client.fullDescription?.trim() || client.description?.trim() || '',
    story: client.story?.trim() || null,
    price: client.price !== undefined && client.price !== '' && client.price !== null ? Number(client.price) : null,
    category_id: client.categoryId || null,
    category_name: client.category?.trim() || null,
    collection_id: client.collectionId || null,
    collection_name: client.collection?.trim() || null,
    material: client.material?.trim() || '',
    colour: client.primaryColor?.trim() || client.colour?.trim() || null,
    colors: Array.isArray(client.colors) ? client.colors : [],
    dimensions: client.dimensions?.trim() || '',
    technique: client.technique?.trim() || '',
    care: client.care?.trim() || '',
    lead_time: client.leadTime?.trim() || '',
    specifications: client.specifications || {},
    images: Array.isArray(client.images) ? client.images.filter(Boolean) : [],
    is_featured: Boolean(client.featured),
    is_published: client.isPublished !== undefined ? Boolean(client.isPublished) : true,
    updated_at: new Date().toISOString(),
  };
}

// ==============================================================================
// PUBLIC CATALOG METHODS (with seamless local fallback)
// ==============================================================================

/**
 * Fetch published products for the public catalogue.
 * Automatically falls back to local PRODUCTS_DATA if Supabase is offline or empty.
 */
export async function getPublicProducts() {
  if (!isSupabaseConfigured || !supabase) {
    return PRODUCTS_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error && error.code !== 'PGRST116') {
        console.info('Using local products catalog fallback:', error?.message);
      }
      return PRODUCTS_DATA;
    }

    return data.map(mapDbProductToClient);
  } catch (err) {
    console.warn('Falling back to local products catalog:', err);
    return PRODUCTS_DATA;
  }
}

/**
 * Fetch active categories for the public site.
 */
export async function getPublicCategories() {
  if (!isSupabaseConfigured || !supabase) {
    return CATEGORIES_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES_DATA;
    }

    return data.map((cat) => ({
      id: cat.slug || cat.id,
      dbId: cat.id,
      name: cat.name,
      tagline: cat.tagline || '',
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.is_active,
    }));
  } catch (err) {
    return CATEGORIES_DATA;
  }
}

/**
 * Fetch published collections for the public site.
 */
export async function getPublicCollections() {
  if (!isSupabaseConfigured || !supabase) {
    return COLLECTIONS_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return COLLECTIONS_DATA;
    }

    return data.map((col) => ({
      id: col.slug || col.id,
      dbId: col.id,
      name: col.name,
      tagline: col.tagline || '',
      year: col.year || '',
      description: col.description || '',
      quote: col.quote || '',
      coverImage: col.banner_image || '',
      isFeatured: col.is_featured,
      isPublished: col.is_published,
    }));
  } catch (err) {
    return COLLECTIONS_DATA;
  }
}

// ==============================================================================
// ADMIN CATALOG METHODS
// ==============================================================================

export async function adminGetAllProducts() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapDbProductToClient);
}

export async function adminCreateProduct(productData) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = mapClientProductToDb(productData);
  payload.created_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return mapDbProductToClient(data);
}

export async function adminUpdateProduct(id, productData) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = mapClientProductToDb(productData);

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbProductToClient(data);
}

export async function adminDeleteProduct(id) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function adminGetAllCategories() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminCreateCategory(category) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    name: category.name?.trim(),
    slug: (category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
    tagline: category.tagline?.trim() || null,
    description: category.description?.trim() || null,
    image: category.image?.trim() || null,
    is_active: category.is_active ?? true,
    display_order: category.display_order ? Number(category.display_order) : 0,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateCategory(id, category) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    name: category.name?.trim(),
    slug: (category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
    tagline: category.tagline?.trim() || null,
    description: category.description?.trim() || null,
    image: category.image?.trim() || null,
    is_active: category.is_active ?? true,
    display_order: category.display_order ? Number(category.display_order) : 0,
  };

  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCategory(id) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function adminGetAllCollections() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminCreateCollection(collection) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    name: collection.name?.trim(),
    slug: (collection.slug || collection.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
    tagline: collection.tagline?.trim() || null,
    year: collection.year?.trim() || null,
    description: collection.description?.trim() || null,
    quote: collection.quote?.trim() || null,
    banner_image: collection.banner_image?.trim() || null,
    is_featured: Boolean(collection.is_featured),
    is_published: collection.is_published ?? true,
    display_order: collection.display_order ? Number(collection.display_order) : 0,
  };

  const { data, error } = await supabase
    .from('collections')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateCollection(id, collection) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    name: collection.name?.trim(),
    slug: (collection.slug || collection.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
    tagline: collection.tagline?.trim() || null,
    year: collection.year?.trim() || null,
    description: collection.description?.trim() || null,
    quote: collection.quote?.trim() || null,
    banner_image: collection.banner_image?.trim() || null,
    is_featured: Boolean(collection.is_featured),
    is_published: collection.is_published ?? true,
    display_order: collection.display_order ? Number(collection.display_order) : 0,
  };

  const { data, error } = await supabase
    .from('collections')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCollection(id) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ==============================================================================
// ENQUIRIES ADMIN METHODS
// ==============================================================================

export async function adminGetAllEnquiries() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    customerName: row.customer_name || row.full_name || 'Anonymous Visitor',
    customerEmail: row.customer_email || row.email || 'N/A',
    customerPhone: row.customer_phone || row.phone || 'N/A',
    productId: row.product_id || null,
    productName: row.product_name || 'General Portfolio Enquiry',
    productImage: row.product_image || null,
    category: row.category || '',
    enquiryType: row.enquiry_type || 'General Consultation',
    quantity: row.quantity || '1',
    message: row.message || '',
    shortlist: row.shortlist || null,
    status: row.status || 'new',
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function adminUpdateEnquiryStatus(id, status, adminNotes = null) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const updatePayload = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== null) {
    updatePayload.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from('enquiries')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteEnquiry(id) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('enquiries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ==============================================================================
// IMAGE UPLOAD VIA SUPABASE STORAGE
// ==============================================================================

/**
 * Uploads a product image file to Supabase Storage in the 'product-images' bucket
 * Returns the public CDN URL.
 */
export async function adminUploadProductImage(file) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
  const fileName = `products/${Date.now()}-${cleanName}.${fileExt}`;

  // Upload to Supabase Storage bucket 'product-images'
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    // If bucket doesn't exist, provide clear error
    if (uploadError.message?.includes('bucket not found')) {
      throw new Error("Storage bucket 'product-images' does not exist. Please create it in your Supabase dashboard under Storage -> New Bucket -> 'product-images' (Public: ON).");
    }
    throw uploadError;
  }

  // Retrieve public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ==============================================================================
// ONE-CLICK DATABASE SEEDER (Populates initial luxury catalog into Supabase)
// ==============================================================================

export async function adminSeedInitialDatabase() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const report = {
    categoriesInserted: 0,
    collectionsInserted: 0,
    productsInserted: 0,
    errors: [],
  };

  // 1. Seed Categories
  const categoryMap = {}; // slug -> id
  for (const cat of CATEGORIES_DATA) {
    try {
      const slug = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data, error } = await supabase
        .from('categories')
        .upsert(
          {
            name: cat.name,
            slug,
            tagline: cat.tagline || '',
            description: cat.description || '',
            image: cat.image || '',
            is_active: true,
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (!error && data) {
        categoryMap[slug] = data.id;
        categoryMap[cat.name] = data.id;
        report.categoriesInserted++;
      } else if (error) {
        report.errors.push(`Category '${cat.name}': ${error.message}`);
      }
    } catch (e) {
      report.errors.push(`Category '${cat.name}': ${e.message}`);
    }
  }

  // 2. Seed Collections
  const collectionMap = {}; // slug -> id
  for (const col of COLLECTIONS_DATA) {
    try {
      const slug = col.id || col.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data, error } = await supabase
        .from('collections')
        .upsert(
          {
            name: col.name,
            slug,
            tagline: col.tagline || '',
            year: col.year || '',
            description: col.description || '',
            quote: col.quote || '',
            banner_image: col.coverImage || '',
            is_featured: true,
            is_published: true,
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (!error && data) {
        collectionMap[slug] = data.id;
        collectionMap[col.name] = data.id;
        report.collectionsInserted++;
      } else if (error) {
        report.errors.push(`Collection '${col.name}': ${error.message}`);
      }
    } catch (e) {
      report.errors.push(`Collection '${col.name}': ${e.message}`);
    }
  }

  // 3. Seed Products
  for (const prod of PRODUCTS_DATA) {
    try {
      const slug = prod.id || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const catId = categoryMap[prod.categoryId] || categoryMap[prod.category] || null;
      const colId = collectionMap[prod.collectionId] || collectionMap[prod.collection] || null;

      const { data, error } = await supabase
        .from('products')
        .upsert(
          {
            name: prod.name,
            slug,
            sku: prod.sku,
            badge: prod.badge || '',
            short_description: prod.shortDescription || '',
            description: prod.fullDescription || '',
            story: prod.story || '',
            price: prod.price || null,
            category_id: catId,
            category_name: prod.category,
            collection_id: colId,
            collection_name: prod.collection,
            material: prod.material,
            colour: prod.primaryColor,
            colors: prod.colors || [],
            dimensions: prod.dimensions,
            technique: prod.technique,
            care: prod.care,
            lead_time: prod.leadTime,
            specifications: prod.specifications || {},
            images: prod.images || [],
            is_featured: Boolean(prod.featured),
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (!error && data) {
        report.productsInserted++;
      } else if (error) {
        report.errors.push(`Product '${prod.name}': ${error.message}`);
      }
    } catch (e) {
      report.errors.push(`Product '${prod.name}': ${e.message}`);
    }
  }

  return report;
}
