const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/database');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize database connection
connectDB();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 ShopEasy E-Commerce REST API is online & running smoothly.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 404 and Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] ShopEasy API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

module.exports = { app, server };
