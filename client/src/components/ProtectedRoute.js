import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, checkToken } = useAuth();

  if (!user || !checkToken()) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoute;