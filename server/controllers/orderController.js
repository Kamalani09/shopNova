import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    const quantity = Number(item.quantity);
    const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      quantity,
      price
    });

    totalPrice += price * quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    totalPrice
  });

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});
