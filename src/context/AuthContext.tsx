import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Load user from localStorage on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setAuthState({
        user: JSON.parse(user),
        loading: false,
        error: null,
      });
    } else {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  // Set axios auth header
  useEffect(() => {
    if (authState.user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.user]);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data } = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('user', JSON.stringify(data));
      
      setAuthState({
        user: data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      });
    }
  };

  const register = async (userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data } = await axios.post('/api/users', userData);
      
      localStorage.setItem('user', JSON.stringify(data));
      
      setAuthState({
        user: data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed',
      }));
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data } = await axios.put('/api/users/profile', userData);
      
      const updatedUser = { ...authState.user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setAuthState({
        user: updatedUser,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Profile update failed',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};