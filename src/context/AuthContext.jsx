import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../config';

const AuthContext = createContext(null);

function readSessionUser() {
  const token = localStorage.getItem('access_token');
  const storedUser =
    localStorage.getItem('user') || localStorage.getItem('user_data');

  if (!token || !storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => setUser(readSessionUser());

    syncSession();
    setLoading(false);

    window.addEventListener('duka_auth_changed', syncSession);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('duka_auth_changed', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const sendOtp = async (email) => {
    const response = await api.post('auth/send-otp/', { email });
    return response.data;
  };

  const verifyOtp = async (email, otp) => {
    const response = await api.post('auth/verify-otp/', { email, otp });
    const { access_token, refresh_token, user: userData } = response.data;

    if (!access_token) {
      throw new Error('OTP sign-in is disabled. Please use email/password or Google sign-in.');
    }

    const serializedUser = JSON.stringify(userData);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', serializedUser);
    localStorage.setItem('user_data', serializedUser);

    setUser(userData);
    window.dispatchEvent(new Event('duka_auth_changed'));
    return response.data;
  };

  const logout = () => {
    ['access_token', 'token', 'refresh_token', 'user', 'user_data'].forEach(
      (key) => localStorage.removeItem(key)
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
