const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter category name'],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide category image URL'],
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
