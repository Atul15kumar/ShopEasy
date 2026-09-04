const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Create a new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return errorResponse(res, 400, 'Complete shipping address is required.');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 400, 'Your cart is empty.');
    }

    // Validate stock and build order items with verified server prices
    let subtotal = 0;
    let totalDiscount = 0;
    const orderProducts = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return errorResponse(res, 400, `Product no longer exists: ${item.product.name}`);
      }

      if (product.stock < item.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`
        );
      }

      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      subtotal += product.price * item.quantity;
      if (product.discountPrice > 0 && product.discountPrice < product.price) {
        totalDiscount += (product.price - product.discountPrice) * item.quantity;
      }

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: effectivePrice,
        quantity: item.quantity,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      });
    }

    const itemsTotal = subtotal - totalDiscount;
    const deliveryCharge = itemsTotal > 50 ? 0 : 5;
    const totalAmount = Math.max(0, itemsTotal + deliveryCharge);

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(totalDiscount * 100) / 100,
      deliveryCharge,
      totalAmount: Math.round(totalAmount * 100) / 100,
      orderStatus: 'Pending',
    });

    // Deduct stock for each purchased product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();

    return successResponse(res, 201, 'Order placed successfully', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Orders retrieved successfully', { orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name images brand');

    if (!order) {
      return errorResponse(res, 404, 'Order not found.');
    }

    // Ensure only the order owner or an admin can access it
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return errorResponse(res, 403, 'Unauthorized to view this order.');
    }

    return successResponse(res, 200, 'Order details retrieved', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found.');
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return errorResponse(res, 403, 'Unauthorized to cancel this order.');
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return errorResponse(
        res,
        400,
        `Cannot cancel order that is already ${order.orderStatus.toLowerCase()}.`
      );
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restore stock back to inventory
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return successResponse(res, 200, 'Order cancelled successfully', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All orders retrieved', { orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found.');
    }

    order.orderStatus = status;
    await order.save();

    return successResponse(res, 200, `Order status updated to ${status}`, { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get admin dashboard metrics
 * @route   GET /api/orders/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return successResponse(res, 200, 'Admin statistics retrieved', {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
};
