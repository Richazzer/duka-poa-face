import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomeLanding from './pages/HomeLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpVerification from './pages/OtpVerification'; // <--- Registered here!
import WelcomeSplash from './pages/WelcomeSplash';
import BusinessOnboarding from './pages/BusinessOnboarding';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/Overview';
import PointOfSale from './pages/PointOfSale';
import ProductsStock from './pages/ProductsStock';
import Purchasing from './pages/Purchasing';
import Money from './pages/Money';
import Customers from './pages/Customers';
import AiManager from './pages/AiManager';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import ProfileSettings from './pages/ProfileSettings';
import MenuPage from './pages/MenuPage';
import EconomicsDashboard from './pages/EconomicsDashboard';
import ToastContainer from './components/common/ToastContainer';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerification />} /> {/* <--- Route active */}
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
                    <Route path="/purchasing" element={<Purchasing />} />
                    <Route path="/money" element={<Money />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/ai-manager" element={<AiManager />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/economics" element={<EconomicsDashboard />} />
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