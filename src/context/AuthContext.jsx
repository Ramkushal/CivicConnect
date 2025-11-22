import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockUsers } from './mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session from localStorage
    const storedUser = localStorage.getItem('mock_user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, metadata) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser = {
      id: `u${Math.floor(Math.random() * 10000)}`,
      email,
      user_metadata: metadata,
      created_at: new Date().toISOString()
    };

    // In a real app we'd add to mockUsers, but for now just log in
    setUser(newUser);
    localStorage.setItem('mock_user_session', JSON.stringify(newUser));
    return { data: { user: newUser }, error: null };
  };

  const signIn = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(u => u.email === email);

    if (foundUser) {
      // Transform to match Supabase user structure
      const sessionUser = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: {
          name: foundUser.name,
          role: foundUser.role,
          profile_photo: foundUser.profile_photo
        }
      };
      setUser(sessionUser);
      localStorage.setItem('mock_user_session', JSON.stringify(sessionUser));
      return { data: { user: sessionUser }, error: null };
    } else {
      return { data: null, error: { message: "Invalid credentials" } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mock_user_session');
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
