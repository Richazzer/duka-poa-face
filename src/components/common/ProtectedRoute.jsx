import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // 1. Check all token formats stored in localStorage
  const token =
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken');

  // 2. If no token at all, only then redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Token exists -> Allow direct access into Overview and Dashboard!
  return children;
}