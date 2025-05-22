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
  const login = async (username, password, remember) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        // Store token in localStorage or sessionStorage based on "Remember Me"
        if (remember) {
          localStorage.setItem('token', data.token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', data.token);
          localStorage.removeItem('token');
        }
        const decoded = jwtDecode(data.token);
        setUser(decoded);
        return true;
      }
      return false;
    } catch {
      return false;
    }
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