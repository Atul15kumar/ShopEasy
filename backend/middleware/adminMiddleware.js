const { errorResponse } = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 403, 'Forbidden. Admin privileges required.');
  }
};

module.exports = {
  adminOnly,
};
