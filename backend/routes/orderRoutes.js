const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect); // All order routes require authentication

// Admin metrics & order management
router.get('/admin/stats', adminOnly, getAdminStats);
router.get('/admin/all', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

// User order flows
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
