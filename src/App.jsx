import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeLanding from './pages/HomeLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
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
import MenuPage from './pages/MenuPage';// <--- Import MenuPage
import ToastContainer from './components/common/ToastContainer';


export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app/*" element={
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
              <Route path="/menu" element={<MenuPage />} /> {/* <--- New Menu Route */}
            </Routes>
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}