import axios from 'axios';

const PLATZI_BASE_URL = 'https://api.escuelajs.co/api/v1';

// In-memory cache for fast lookups
let productsCache = [];

/**
 * Sanitize image URLs returned by Platzi API (some contain stringified brackets or malformed JSON)
 */
export const cleanImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
  }
  let cleaned = url.trim();

  // Strip brackets, quotes or JSON array syntax if present
  if (cleaned.startsWith('[') || cleaned.startsWith('"')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cleaned = String(parsed[0]);
      } else if (typeof parsed === 'string') {
        cleaned = parsed;
      }
    } catch (e) {
      cleaned = cleaned.replace(/^[\["'\s]+|[\]"'\s]+$/g, '');
    }
  }

  // Remove surrounding quotes or escaped slashes
  cleaned = cleaned.replace(/^["']+|["']+$/g, '').replace(/\\"/g, '');

  if (!cleaned.startsWith('http')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
  }

  return cleaned;
};

/**
 * Format a Platzi product into ShopEasy's exact structure
 */
export const formatProduct = (p) => {
  const rawImages = Array.isArray(p.images) ? p.images : [p.images].filter(Boolean);
  let cleanedImages = rawImages.map(cleanImageUrl).filter(Boolean);

  if (cleanedImages.length === 0) {
    cleanedImages = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'];
  }

  const categoryObj =
    typeof p.category === 'object' && p.category
      ? {
          _id: String(p.category.id || '1'),
          id: p.category.id || 1,
          name: p.category.name || 'General',
          image: cleanImageUrl(p.category.image),
        }
      : {
          _id: '1',
          id: 1,
          name: String(p.category || 'General'),
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        };

  const id = String(p.id);
  const price = Number(p.price) || 29;
  // Apply a 15% discount badge on select products
  const hasDiscount = p.id % 2 === 0;
  const discountPrice = hasDiscount ? Math.round(price * 0.85) : 0;

  return {
    _id: id,
    id: p.id,
    name: p.title || 'ShopEasy Product',
    title: p.title || 'ShopEasy Product',
    description:
      p.description ||
      'Premium quality product crafted for comfort, style, and everyday performance. Includes standard ShopEasy warranty.',
    price,
    discountPrice,
    images: cleanedImages,
    category: categoryObj,
    stock: 25,
    rating: Number((4.2 + (p.id % 8) * 0.1).toFixed(1)),
    numReviews: 12 + (p.id % 45),
    brand: categoryObj.name ? `ShopEasy ${categoryObj.name}` : 'ShopEasy Collection',
    isFeatured: p.id % 3 === 0,
    isPopular: p.id % 2 === 0,
    isNewArrival: p.id % 4 === 0,
    isBestSeller: p.id % 5 === 0,
  };
};

/**
 * Format a Platzi category into ShopEasy's category structure
 */
export const formatCategory = (c) => ({
  _id: String(c.id),
  id: c.id,
  name: c.name,
  image: cleanImageUrl(c.image),
  productCount: 20,
});

/**
 * Fetch all categories directly from Platzi API
 */
export const fetchCategories = async () => {
  try {
    const res = await axios.get(`${PLATZI_BASE_URL}/categories`);
    const rawCategories = Array.isArray(res.data) ? res.data : [];
    const valid = rawCategories
      .filter((c) => c && c.name && c.id)
      .slice(0, 10)
      .map(formatCategory);

    return {
      success: true,
      data: {
        categories: valid,
      },
    };
  } catch (error) {
    console.warn('[ProductService] Error fetching categories:', error.message);
    return {
      success: true,
      data: {
        categories: [
          { _id: '1', id: 1, name: 'Clothes', image: 'https://i.imgur.com/QkIa5tT.jpeg' },
          { _id: '2', id: 2, name: 'Electronics', image: 'https://i.imgur.com/ZANVnHE.jpeg' },
          { _id: '3', id: 3, name: 'Furniture', image: 'https://i.imgur.com/Qphac99.jpeg' },
          { _id: '4', id: 4, name: 'Shoes', image: 'https://i.imgur.com/qNOjJje.jpeg' },
          { _id: '5', id: 5, name: 'Miscellaneous', image: 'https://i.imgur.com/BG8J0Fj.jpg' },
        ].map(formatCategory),
      },
    };
  }
};

/**
 * Fetch products from Platzi API with full client-side filtering, searching & sorting
 */
export const fetchProducts = async (params = {}) => {
  try {
    const queryParams = {};
    if (params.category) queryParams.categoryId = params.category;

    const res = await axios.get(`${PLATZI_BASE_URL}/products`, { params: queryParams });
    const rawList = Array.isArray(res.data) ? res.data : [];
    let formatted = rawList.map(formatProduct);

    // Save to cache for quick detail lookup
    if (!params.q && !params.category) {
      productsCache = formatted;
    }

    // Client-side keyword search across title, description, category and brand
    if (params.q && params.q.trim()) {
      const q = params.q.trim().toLowerCase();
      formatted = formatted.filter((p) => {
        const title = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (p.category?.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q) || brand.includes(q);
      });
    }

    // Client-side price filter
    if (params.minPrice !== undefined && params.minPrice !== '') {
      formatted = formatted.filter((p) => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice !== undefined && params.maxPrice !== '') {
      formatted = formatted.filter((p) => p.price <= Number(params.maxPrice));
    }

    // Filter by special groups if requested
    if (params.featured === 'true') {
      formatted = formatted.filter((p) => p.isFeatured);
    } else if (params.popular === 'true') {
      formatted = formatted.filter((p) => p.isPopular);
    } else if (params.newArrival === 'true') {
      formatted = formatted.filter((p) => p.isNewArrival);
    } else if (params.bestSeller === 'true') {
      formatted = formatted.filter((p) => p.isBestSeller);
    }

    // Apply sorting
    if (params.sort === 'price_asc') {
      formatted.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      formatted.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'rating_desc') {
      formatted.sort((a, b) => b.rating - a.rating);
    } else {
      formatted.sort((a, b) => b.id - a.id);
    }

    // Pagination
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || (params.featured || params.popular ? 6 : 20);
    const total = formatted.length;
    const pages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = formatted.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        products: paginatedProducts,
        total,
        page,
        pages,
      },
    };
  } catch (error) {
    console.warn('[ProductService] Error fetching products:', error.message);
    return {
      success: false,
      data: {
        products: [],
        total: 0,
        page: 1,
        pages: 1,
      },
    };
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id) => {
  try {
    const cached = productsCache.find(
      (p) => String(p._id) === String(id) || String(p.id) === String(id)
    );
    if (cached) {
      return {
        success: true,
        data: { product: cached },
      };
    }

    const res = await axios.get(`${PLATZI_BASE_URL}/products/${id}`);
    if (res.data) {
      const formatted = formatProduct(res.data);
      return {
        success: true,
        data: { product: formatted },
      };
    }
    throw new Error('Product not found');
  } catch (error) {
    console.warn(`[ProductService] Error fetching product ${id}:`, error.message);
    throw error;
  }
};

export default {
  fetchProducts,
  fetchProductById,
  fetchCategories,
};
