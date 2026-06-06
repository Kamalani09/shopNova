import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/products', { params: { search } });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <section className="section">
      <div className="section-heading">
        <h1>Products</h1>
      </div>
      <input
        className="search-input"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, category, or description"
      />

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
