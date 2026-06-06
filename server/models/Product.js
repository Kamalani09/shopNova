import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [imageSchema],
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: 'ShopNova' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Indexes make search and common filters faster.
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });

// Virtual field used by the frontend to show sale savings.
productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Generate a clean URL slug from the product name.
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = `${slugify(this.name)}-${Date.now().toString(36)}`;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
