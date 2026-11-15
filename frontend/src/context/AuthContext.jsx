import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eldercare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('eldercare_role') || null;
  });

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res && res.success) {
      setUser(res.user);
      setRole(res.role);
      localStorage.setItem('eldercare_user', JSON.stringify(res.user));
      localStorage.setItem('eldercare_role', res.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('eldercare_user');
    localStorage.removeItem('eldercare_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
