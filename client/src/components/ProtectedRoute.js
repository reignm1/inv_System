import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Don't call checkToken() here - just check if user exists
  // The AuthProvider already handles token validation in its useEffect
  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoute;