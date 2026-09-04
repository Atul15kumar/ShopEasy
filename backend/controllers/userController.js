const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get user's saved addresses
 * @route   GET /api/users/address
 * @access  Private
 */
const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, 200, 'Addresses retrieved successfully', {
      addresses: user.addresses || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new address
 * @route   POST /api/users/address
 * @access  Private
 */
const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, houseFlat, street, city, state, pinCode, country, isDefault } = req.body;

    if (!fullName || !phone || !houseFlat || !street || !city || !state || !pinCode) {
      return errorResponse(res, 400, 'Please provide all mandatory address fields.');
    }

    const user = await User.findById(req.user._id);

    // If marked as default or it's the first address, clear existing defaults
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName,
      phone,
      houseFlat,
      street,
      city,
      state,
      pinCode,
      country: country || 'United States',
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    return successResponse(res, 201, 'Address added successfully', {
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an address
 * @route   PUT /api/users/address/:id
 * @access  Private
 */
const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(id);
    if (!address) {
      return errorResponse(res, 404, 'Address not found.');
    }

    const { fullName, phone, houseFlat, street, city, state, pinCode, country, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (houseFlat) address.houseFlat = houseFlat;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pinCode) address.pinCode = pinCode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    return successResponse(res, 200, 'Address updated successfully', {
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/users/address/:id
 * @access  Private
 */
const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(id);
    if (!address) {
      return errorResponse(res, 404, 'Address not found.');
    }

    user.addresses.pull(id);

    // If default address was deleted, set first remaining as default
    if (address.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return successResponse(res, 200, 'Address deleted successfully', {
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users/admin/all
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, 200, 'Users retrieved successfully', { users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
};
