import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SplashScreen from '../common/SplashScreen';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen message="Inathibitisha akaunti yako..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
