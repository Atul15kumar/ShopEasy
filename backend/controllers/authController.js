const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Please provide name, email, and password.');
    }

    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 400, 'Passwords do not match.');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters long.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'A user with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: 'user',
    });

    const token = generateToken(user._id, user.role);

    return successResponse(res, 201, 'User registered successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please enter email and password.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    return successResponse(res, 200, 'Profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    const { name, phone, profileImage, password } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    if (password) {
      if (password.length < 6) {
        return errorResponse(res, 400, 'Password must be at least 6 characters.');
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    return successResponse(res, 200, 'Profile updated successfully', {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
