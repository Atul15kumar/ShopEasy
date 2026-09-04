const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Helper to compute cart financial totals
 */
const calculateCartTotals = (items) => {
  let subtotal = 0;
  let totalDiscount = 0;

  const validItems = [];

  for (const item of items) {
    if (!item.product) continue;

    const prod = item.product;
    const effectivePrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
    const originalPrice = prod.price;

    subtotal += originalPrice * item.quantity;
    if (prod.discountPrice > 0 && prod.discountPrice < originalPrice) {
      totalDiscount += (originalPrice - prod.discountPrice) * item.quantity;
    }

    validItems.push(item);
  }

  const itemsTotal = subtotal - totalDiscount;
  const deliveryCharge = itemsTotal > 50 || itemsTotal === 0 ? 0 : 5;
  const totalAmount = Math.max(0, itemsTotal + deliveryCharge);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(totalDiscount * 100) / 100,
    deliveryCharge,
    totalAmount: Math.round(totalAmount * 100) / 100,
    items: validItems,
  };
};

/**
 * @desc    Get user's shopping cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const { subtotal, discount, deliveryCharge, totalAmount, items } = calculateCartTotals(cart.items);

    return successResponse(res, 200, 'Cart retrieved successfully', {
      cart: {
        _id: cart._id,
        items,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return errorResponse(res, 400, 'Product ID is required.');
    }

    const qty = Math.max(1, parseInt(quantity, 10));
    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    if (product.stock < qty) {
      return errorResponse(res, 400, `Only ${product.stock} items available in stock.`);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + qty;
      if (newQty > product.stock) {
        return errorResponse(res, 400, `Cannot add more. Stock limit of ${product.stock} reached.`);
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand',
    });

    const totals = calculateCartTotals(cart.items);

    return successResponse(res, 200, 'Product added to cart', {
      cart: {
        _id: cart._id,
        items: totals.items,
        ...totals,
        itemCount: totals.items.reduce((acc, curr) => acc + curr.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found.');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return errorResponse(res, 404, 'Item not found in cart.');
    }

    const qty = parseInt(quantity, 10);

    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify stock
      const product = await Product.findById(productId);
      if (!product) {
        cart.items.splice(itemIndex, 1);
      } else if (qty > product.stock) {
        return errorResponse(res, 400, `Only ${product.stock} items available in stock.`);
      } else {
        cart.items[itemIndex].quantity = qty;
      }
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand',
    });

    const totals = calculateCartTotals(cart.items);

    return successResponse(res, 200, 'Cart updated successfully', {
      cart: {
        _id: cart._id,
        items: totals.items,
        ...totals,
        itemCount: totals.items.reduce((acc, curr) => acc + curr.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found.');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand',
    });

    const totals = calculateCartTotals(cart.items);

    return successResponse(res, 200, 'Item removed from cart', {
      cart: {
        _id: cart._id,
        items: totals.items,
        ...totals,
        itemCount: totals.items.reduce((acc, curr) => acc + curr.quantity, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all items in cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return successResponse(res, 200, 'Cart cleared successfully', {
      cart: {
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        totalAmount: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
