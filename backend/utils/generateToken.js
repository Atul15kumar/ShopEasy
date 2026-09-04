const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {string} userId - Mongo user ID
 * @param {string} role - 'user' | 'admin'
 * @returns {string} - Signed JWT
 */
const generateToken = (userId, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'shopeasy_super_secret_jwt_key_2026_production_safe';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    secret,
    {
      expiresIn: expiresIn,
    }
  );
};

module.exports = generateToken;
