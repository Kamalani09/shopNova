import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000
});

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie('jwt', token, cookieOptions());
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json(user);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json(user);
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { ...cookieOptions(), maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
};

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});
