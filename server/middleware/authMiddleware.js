import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes by checking the JWT stored in the httpOnly cookie.
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.userId).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  next();
});

// Admin middleware is used for product creation.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }

  res.status(403);
  next(new Error('Not authorized as an admin'));
};
