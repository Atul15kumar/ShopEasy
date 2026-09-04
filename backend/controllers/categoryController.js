const Category = require('../models/Category');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return successResponse(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;

    if (!name || !image) {
      return errorResponse(res, 400, 'Category name and image URL are required.');
    }

    const categoryExists = await Category.findOne({ name: name.trim() });
    if (categoryExists) {
      return errorResponse(res, 400, 'Category with this name already exists.');
    }

    const category = await Category.create({
      name: name.trim(),
      image,
      description: description || '',
    });

    return successResponse(res, 201, 'Category created successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 404, 'Category not found.');
    }

    if (name) category.name = name.trim();
    if (image) category.image = image;
    if (description !== undefined) category.description = description;

    const updatedCategory = await category.save();

    return successResponse(res, 200, 'Category updated successfully', { category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 404, 'Category not found.');
    }

    // Check if products exist in category
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete category. ${productCount} products are still linked to this category.`
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
