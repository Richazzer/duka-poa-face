import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomeLanding from './pages/HomeLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification';
import WelcomeSplash from './pages/WelcomeSplash';
import BusinessOnboarding from './pages/BusinessOnboarding';

import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/Overview';
import PointOfSale from './pages/PointOfSale';
import ProductsStock from './pages/ProductsStock';
import Customers from './pages/Customers';
import AiManager from './pages/AiManager';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerification />} />
          <Route path="/welcome" element={<WelcomeSplash />} />
          <Route path="/onboarding/splash" element={<BusinessOnboarding />} />

          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/pos" element={<PointOfSale />} />
                    <Route path="/products" element={<ProductsStock />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/ai-manager" element={<AiManager />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}