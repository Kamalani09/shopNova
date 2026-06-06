import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables before using process.env anywhere else.
dotenv.config();

// Connect to MongoDB Atlas.
connectDB();

// Configure Cloudinary once when the server starts.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

// Allow the Vite frontend to call this API and send cookies.
app.use(
  cors({
    origin(origin, callback) {
      // Browser requests include an origin. Tools like Postman usually do not.
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowedLocalhost =
        process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin);

      if (allowedOrigins.includes(origin) || isAllowedLocalhost) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);

// Parse JSON request bodies, URL-encoded form bodies, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'ShopNova API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Custom error middleware should be registered after all routes.
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
