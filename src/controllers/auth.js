const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const signToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ where: { email } })) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ success: true, user: publicUser(user), token: signToken(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) throw new ApiError(401, 'Invalid email or password');

  res.json({ success: true, user: publicUser(user), token: signToken(user) });
});
