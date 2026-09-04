const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images rating stock brand category',
      populate: { path: 'category', select: 'name' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return successResponse(res, 200, 'Wishlist retrieved successfully', {
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add or toggle product in wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const alreadyInWishlist = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      return successResponse(res, 200, 'Product already in wishlist', {
        wishlist: {
          _id: wishlist._id,
          count: wishlist.products.length,
        },
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'name price discountPrice images rating stock brand category',
      populate: { path: 'category', select: 'name' },
    });

    return successResponse(res, 201, 'Product added to wishlist', {
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return errorResponse(res, 404, 'Wishlist not found.');
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'name price discountPrice images rating stock brand category',
      populate: { path: 'category', select: 'name' },
    });

    return successResponse(res, 200, 'Product removed from wishlist', {
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
