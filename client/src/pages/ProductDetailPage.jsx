import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) return <section className="section"><p>Loading product...</p></section>;
  if (!product) return <section className="section"><p>Product not found.</p></section>;

  const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';
  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  return (
    <section className="section product-detail">
      <img className="detail-image" src={image} alt={product.name} />
      <div className="detail-content">
        <p className="product-category">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="price-row large">
          <strong>₹{finalPrice.toLocaleString('en-IN')}</strong>
          {product.discountPrice && product.discountPrice < product.price ? (
            <span>₹{product.price.toLocaleString('en-IN')}</span>
          ) : null}
        </div>
        <p>{product.description}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
        <button className="btn" disabled={product.stock === 0} onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </section>
  );
}

export default ProductDetailPage;
