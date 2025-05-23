import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check both localStorage and sessionStorage for token
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (Date.now() < decoded.exp * 1000) {
          setUser(decoded);
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
        }
      } catch {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser(data.user); // Make sure setUser updates your context state
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const checkToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setUser(null);
      return false;
    }
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};