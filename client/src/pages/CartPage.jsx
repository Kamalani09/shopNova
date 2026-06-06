import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const emptyAddress = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phone: ''
};

function CartPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setShippingAddress({ ...shippingAddress, [event.target.name]: event.target.value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    try {
      const items = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity
      }));

      await api.post('/api/orders', {
        items,
        shippingAddress,
        paymentMethod: 'Cash on Delivery'
      });

      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="section cart-layout">
      <div>
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link to="/products">Browse products</Link></p>
        ) : (
          <div className="cart-list">
            {cartItems.map((item) => {
              const image = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
              const price = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;

              return (
                <div className="cart-item" key={item._id}>
                  <img src={image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>₹{price.toLocaleString('en-IN')}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item._id, Number(event.target.value))}
                  />
                  <button className="btn ghost" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form className="checkout-card" onSubmit={placeOrder}>
        <h2>Checkout</h2>
        <p className="total">Total: ₹{cartTotal.toLocaleString('en-IN')}</p>
        <input name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} placeholder="Full name" required />
        <input name="street" value={shippingAddress.street} onChange={handleAddressChange} placeholder="Street address" required />
        <input name="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="City" required />
        <input name="state" value={shippingAddress.state} onChange={handleAddressChange} placeholder="State" required />
        <input name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} placeholder="Postal code" required />
        <input name="country" value={shippingAddress.country} onChange={handleAddressChange} placeholder="Country" required />
        <input name="phone" value={shippingAddress.phone} onChange={handleAddressChange} placeholder="Phone" required />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn full" disabled={placingOrder || cartItems.length === 0}>
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </section>
  );
}

export default CartPage;
