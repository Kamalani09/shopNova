import express from 'express';
import multer from 'multer';
import { createProduct, getProductById, getProducts } from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory storage keeps uploads in RAM briefly before sending them to Cloudinary.
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.array('images', 5), createProduct);

export default router;
