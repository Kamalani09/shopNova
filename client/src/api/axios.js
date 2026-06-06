import axios from 'axios';

// Vercel will use VITE_API_URL. Local development falls back to Express on port 5000.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

export default api;
