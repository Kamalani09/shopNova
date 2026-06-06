import { Link } from 'react-router-dom';

function OrderSuccessPage() {
  return (
    <section className="success-page">
      <div className="success-card">
        <h1>Order placed successfully!</h1>
        <p>Thank you for shopping with ShopNova. Your order is now pending and will be processed soon.</p>
        <Link className="btn" to="/products">Continue Shopping</Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
