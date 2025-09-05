import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
  setUser({ id: payload.sub, email: payload.email } as any);
      } catch (e) {
        console.warn('invalid token', e);
      }
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    login: async (email: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/auth/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('authToken', data.token);
      setUser(data.user);
      return data.user;
    },
    logout: async () => {
      localStorage.removeItem('authToken');
      setUser(null);
    },
  };
};
