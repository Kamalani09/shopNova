import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" minLength="6" value={formData.password} onChange={handleChange} placeholder="Password" required />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn full">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}

export default RegisterPage;
