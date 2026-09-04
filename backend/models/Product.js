const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify product category'],
    },
    brand: {
      type: String,
      required: [true, 'Please specify product brand'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'Product must have at least one image',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    stock: {
      type: Number,
      required: [true, 'Please specify product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text search index on name, brand and description
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
