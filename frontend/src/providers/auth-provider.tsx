// Auth provider with user state management, login/logout functionality, and token validation
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('authToken');

      if (token) {
        try {
          // Fetch user data from backend to verify token is still valid
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // Token is invalid, remove it
            deleteCookie('authToken');
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          deleteCookie('authToken');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setCookie('authToken', token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setUser(userData);
  };

  const logout = async () => {
    try {
      const token = getCookie('authToken');

      if (token) {
        // Call backend logout endpoint
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local state and redirect
      deleteCookie('authToken');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
