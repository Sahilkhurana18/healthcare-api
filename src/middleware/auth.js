const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError, asyncHandler } = require('./errorHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication required');

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(payload.id, { attributes: ['id', 'name', 'email'] });
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});
