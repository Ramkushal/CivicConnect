import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await client.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Session expired or invalid:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const signUp = async (email, password, metadata) => {
    try {
      const { data } = await client.post('/auth/register', {
        email,
        password,
        ...metadata
      });
      
      localStorage.setItem('token', data.token);
      setUser(data);
      return { data: { user: data }, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error.response?.data?.message || 'Registration failed' } 
      };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data } = await client.post('/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      setUser(data);
      return { data: { user: data }, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error.response?.data?.message || 'Login failed' } 
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
