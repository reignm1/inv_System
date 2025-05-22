import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return null; // Or redirect to login
  if (!allowedRoles.includes(user.user_Role)) return <div>Access Denied</div>;
  return children;
};

export default RoleProtectedRoute;