import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  return (
    <Link className="product-card" to={`/products/${product._id}`}>
      <img src={image} alt={product.name} />
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="price-row">
          <strong>₹{finalPrice.toLocaleString('en-IN')}</strong>
          {product.discountPrice && product.discountPrice < product.price ? (
            <span>₹{product.price.toLocaleString('en-IN')}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
