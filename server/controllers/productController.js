import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'shopnova/products' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });

export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { category: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  const products = await Product.find(keyword).sort({ createdAt: -1 });
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, stock, isFeatured, imageUrl } =
    req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Name, description, price, and category are required');
  }

  const uploadedImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer);
      uploadedImages.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    }
  } else if (imageUrl) {
    uploadedImages.push({ url: imageUrl, publicId: '' });
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    category,
    brand,
    stock: stock ? Number(stock) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    images: uploadedImages,
    createdBy: req.user._id
  });

  res.status(201).json(product);
});
