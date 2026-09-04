const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized. Token is required.');
  }

  try {
    const secret = process.env.JWT_SECRET || 'shopeasy_super_secret_jwt_key_2026_production_safe';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error.message);
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid authentication token.');
  }
};

module.exports = {
  protect,
};
