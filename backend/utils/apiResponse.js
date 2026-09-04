/**
 * Standardized API success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable response message
 * @param {any} data - Payload data
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized API error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error description
 * @param {any} errors - Detailed validation errors if any
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
