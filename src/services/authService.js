import api from './api';

export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout/');
  } catch (err) {
    console.error("Logout request failed, clearing local state anyway", err);
  }
};