import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">ShopNova</Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        {user ? <NavLink to="/admin/products/new">Add Product</NavLink> : null}
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
      </nav>
      <div className="nav-user">
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button className="btn ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
