import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const visibleProducts = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Fresh finds. Fair prices.</p>
          <h1>ShopNova</h1>
          <p>Discover everyday products with a clean shopping experience built for learning MERN.</p>
          <Link className="btn hero-btn" to="/products">Start Shopping</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Featured Products</h2>
          <Link to="/products">View all</Link>
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : visibleProducts.length === 0 ? (
          <p>No products yet. Create products from the admin API route.</p>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;
