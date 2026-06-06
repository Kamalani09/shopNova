import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: 'ShopNova',
  stock: '',
  isFeatured: true
};

function AdminProductPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const previews = useMemo(
    () => images.map((image) => ({ name: image.name, url: URL.createObjectURL(image) })),
    [images]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          payload.append(key, value);
        }
      });

      images.forEach((image) => {
        payload.append('images', image);
      });

      const { data } = await api.post('/api/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Product uploaded successfully.');
      setFormData(initialForm);
      setImages([]);
      setTimeout(() => navigate(`/products/${data._id}`), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Product upload failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <p>Checking admin access...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section empty-state">
        <h1>Login Required</h1>
        <p>Please login before adding products.</p>
        <Link className="btn" to="/login">Login</Link>
      </section>
    );
  }

  if (user.role !== 'admin') {
    return (
      <section className="section empty-state">
        <h1>Admin Only</h1>
        <p>Your account must have the admin role to add products.</p>
        <Link className="btn" to="/products">Back to Products</Link>
      </section>
    );
  }

  return (
    <section className="section admin-layout">
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="section-heading">
          <h1>Add Product</h1>
        </div>

        <label>
          Product name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <div className="form-grid">
          <label>
            Price
            <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
          </label>
          <label>
            Discount price
            <input name="discountPrice" type="number" min="0" value={formData.discountPrice} onChange={handleChange} />
          </label>
        </div>

        <div className="form-grid">
          <label>
            Category
            <input name="category" value={formData.category} onChange={handleChange} required />
          </label>
          <label>
            Brand
            <input name="brand" value={formData.brand} onChange={handleChange} />
          </label>
        </div>

        <label>
          Stock
          <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
        </label>

        <label className="checkbox-row">
          <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} />
          Featured product
        </label>

        <label>
          Product images
          <input type="file" accept="image/*" multiple onChange={handleImageChange} required />
        </label>

        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}

        <button className="btn full" disabled={saving}>
          {saving ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>

      <aside className="preview-panel">
        <h2>Image Preview</h2>
        {previews.length === 0 ? (
          <p>Choose one or more product images.</p>
        ) : (
          <div className="preview-grid">
            {previews.map((preview) => (
              <img key={preview.url} src={preview.url} alt={preview.name} />
            ))}
          </div>
        )}
      </aside>
    </section>
  );
}

export default AdminProductPage;
