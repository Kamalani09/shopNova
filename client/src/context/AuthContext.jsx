import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  const register = async (formData) => {
    const { data } = await api.post('/api/auth/register', formData);
    setUser(data);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post('/api/auth/login', formData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
