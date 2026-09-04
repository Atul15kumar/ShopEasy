const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect); // All user profile & address routes require authentication

// Admin user inspection
router.get('/admin/all', adminOnly, getAllUsers);

// User address CRUD
router.get('/address', getAddresses);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

module.exports = router;
