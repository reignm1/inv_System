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
          // Always use the decoded JWT data for consistency
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
    
    // Decode the token to get user info consistently
    try {
      const decoded = jwtDecode(data.token);
      setUser(decoded); // Use decoded token data instead of data.user
    } catch (error) {
      console.error('Failed to decode token:', error);
      // Fallback to using data.user if token decode fails
      setUser(data.user);
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
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};