const Product = require('../models/Product');
const { uploadToCloudinary } = require('../config/cloudinary');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all products with filtering, searching, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      featured,
      popular,
      newArrival,
      bestSeller,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Keyword / Search Filter
    const searchTerm = keyword || q;
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Brand Filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Rating Filter
    if (minRating !== undefined && minRating !== '') {
      query.rating = { $gte: Number(minRating) };
    }

    // Flag Filters
    if (featured === 'true') query.isFeatured = true;
    if (popular === 'true') query.isPopular = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating_desc') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name image')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    return successResponse(res, 200, 'Products retrieved successfully', {
      products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name image');

    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    return successResponse(res, 200, 'Product retrieved successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      specifications,
      isFeatured,
      isPopular,
      isNewArrival,
      isBestSeller,
    } = req.body;

    let imageUrls = [];

    // Check if uploaded files exist via multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    } else if (req.body.images) {
      // Direct array or single string of images passed
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      imageUrls = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'];
    }

    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try {
        parsedSpecs = JSON.parse(specifications);
      } catch (e) {
        parsedSpecs = [];
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      brand,
      images: imageUrls,
      stock: stock ? Number(stock) : 10,
      specifications: parsedSpecs || [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isPopular: isPopular === 'true' || isPopular === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    });

    return successResponse(res, 201, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    // Handle new uploaded images if provided
    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        newUrls.push(url);
      }
      req.body.images = [...product.images, ...newUrls];
    }

    if (typeof req.body.specifications === 'string') {
      try {
        req.body.specifications = JSON.parse(req.body.specifications);
      } catch (e) {
        delete req.body.specifications;
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name image');

    return successResponse(res, 200, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    await Product.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
