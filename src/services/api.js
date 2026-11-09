import axios from 'axios';

// =====================================================================
// SHARED API CLIENT  (save as src/api.js)
// Used by Overview, PointOfSale, ProductsStock and every other screen.
// =====================================================================
// Your live backend. VITE_API_URL (Vercel env var) can override it, but it is not required.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://duka-poa.onrender.com').replace(/\/+$/, '');

// The login screen may store tokens under different names, so we look for all the common ones
// (in localStorage and sessionStorage). Put your own key first if you know it.
const ACCESS_KEYS = ['access_token', 'access', 'token', 'accessToken', 'authToken', 'duka_access_token'];
const REFRESH_KEYS = ['refresh_token', 'refresh', 'refreshToken', 'duka_refresh_token'];

const stores = () => {
  try {
    return [window.localStorage, window.sessionStorage];
  } catch {
    return [];
  }
};

// Finds a token and remembers where it was stored
const findToken = (keys) => {
  for (const store of stores()) {
    for (const key of keys) {
      try {
        let value = store.getItem(key);
        if (value) {
          value = value.replace(/^"|"$/g, ''); // some apps save it as JSON text
          if (value && value !== 'null' && value !== 'undefined') return { value, store, key };
        }
      } catch {
        /* ignore */
      }
    }
  }
  return null;
};

const saveAccessToken = (value) => {
  const found = findToken(ACCESS_KEYS);
  try {
    (found?.store || window.localStorage).setItem(found?.key || ACCESS_KEYS[0], value);
  } catch {
    /* ignore */
  }
};

const clearTokens = () => {
  for (const store of stores()) {
    for (const key of [...ACCESS_KEYS, ...REFRESH_KEYS]) {
      try {
        store.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }
};

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 60000 // Render free tier can take ~50s to wake up
});

// 1. Send the logged-in user's token with every request
api.interceptors.request.use((config) => {
  const token = findToken(ACCESS_KEYS)?.value;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2. If the access token expired, get a new one once and retry the request
let refreshing = null;

const refreshAccessToken = async () => {
  const refresh = findToken(REFRESH_KEYS)?.value;
  if (!refresh) throw new Error('No refresh token');
  const res = await axios.post(`${API_URL}/api/v1/auth/refresh/`, { refresh_token: refresh });
  saveAccessToken(res.data.access_token);
  return res.data.access_token;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || !original || original._retried) {
      return Promise.reject(error);
    }
    original._retried = true;
    try {
      refreshing = refreshing || refreshAccessToken().finally(() => (refreshing = null));
      const token = await refreshing;
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      clearTokens();
      // Let the app send the user to the login screen: window.addEventListener('duka:logout', ...)
      window.dispatchEvent(new Event('duka:logout'));
      return Promise.reject(error);
    }
  }
);

// =====================================================================
// ERROR HELPER: readable Swahili message from any API error
// =====================================================================
export const getErrorMessage = (err, fallback) => {
  if (err?.code === 'ECONNABORTED') {
    return 'Seva imechukua muda mrefu kujibu. Jaribu tena baada ya sekunde chache.';
  }
  if (!err?.response) {
    return 'Hakuna mawasiliano na seva. Hakikisha una intaneti na seva iko wazi.';
  }
  if (err.response.status === 401) return 'Kipindi chako kimeisha. Tafadhali toka kisha ingia tena.';
  if (err.response.status === 429) return 'Umejaribu mara nyingi sana. Subiri dakika chache.';

  const data = err.response.data;
  if (typeof data?.error === 'string') return data.error;
  if (data && typeof data === 'object') {
    const first = Object.entries(data)[0];
    if (first) {
      const [field, msg] = first;
      const text = Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : '';
      if (text) return `${field}: ${text}`;
    }
  }
  return fallback;
};
