import axios from 'axios';

// =====================================================================
// SHARED API CLIENT  (save as src/services/api.js)
// Used by Overview, PointOfSale, ProductsStock and every other screen.
// =====================================================================
// Your live backend. VITE_API_URL (Vercel env var) can override it, but it is not required.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://duka-poa.onrender.com').replace(/\/+$/, '');

// =====================================================================
// TOKEN LOOKUP
// Finds the login token wherever your login screen saved it: any key name,
// localStorage or sessionStorage, even inside a saved JSON object (Zustand/Redux persist).
// =====================================================================
const OWN_ACCESS_KEY = 'access_token'; // where a refreshed token is saved

const stores = () => {
  try {
    return [window.localStorage, window.sessionStorage];
  } catch {
    return [];
  }
};

const JWT_PATTERN = /^eyJ[\w-]+\.[\w-]+\.[\w-]*$/;

const decodeJwt = (token) => {
  try {
    let part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (part.length % 4) part += '=';
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
};

// Walks strings, JSON text and objects, collecting every JWT inside
const collectJwts = (value, out, depth = 0) => {
  if (value == null || depth > 5) return;
  if (typeof value === 'string') {
    const clean = value.trim().replace(/^"|"$/g, '');
    if (JWT_PATTERN.test(clean)) {
      out.push(clean);
    } else if (clean.startsWith('{') || clean.startsWith('[')) {
      try {
        collectJwts(JSON.parse(clean), out, depth + 1);
      } catch {
        /* not JSON */
      }
    }
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((v) => collectJwts(v, out, depth + 1));
  }
};

// kind = 'access' | 'refresh'. Returns the newest matching token, or null.
const findToken = (kind) => {
  const found = [];
  for (const store of stores()) {
    try {
      for (let i = 0; i < store.length; i += 1) {
        collectJwts(store.getItem(store.key(i)), found);
      }
    } catch {
      /* ignore */
    }
  }

  const matches = found
    .map((token) => ({ token, payload: decodeJwt(token) }))
    .filter(({ payload }) => {
      const type = payload?.token_type;
      return kind === 'refresh' ? type === 'refresh' : type !== 'refresh';
    })
    .sort((a, b) => (b.payload?.exp || 0) - (a.payload?.exp || 0));

  return matches[0]?.token || null;
};

const saveAccessToken = (value) => {
  try {
    window.localStorage.setItem(OWN_ACCESS_KEY, value);
  } catch {
    /* ignore */
  }
};

const clearTokens = () => {
  for (const store of stores()) {
    for (const key of [OWN_ACCESS_KEY, 'access', 'token', 'accessToken', 'refresh_token', 'refresh', 'refreshToken']) {
      try {
        store.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }
};

let warnedNoToken = false;
const warnNoToken = () => {
  if (warnedNoToken) return;
  warnedNoToken = true;
  const names = stores().map((s) => {
    try {
      return Array.from({ length: s.length }, (_, i) => s.key(i));
    } catch {
      return [];
    }
  });
  console.warn('[duka api] No login token found. Storage keys (local, session):', names);
};

// =====================================================================
// AXIOS INSTANCE
// =====================================================================
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 60000 // Render free tier can take ~50s to wake up
});

// 1. Send the logged-in user's token with every request
api.interceptors.request.use((config) => {
  const token = findToken('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    warnNoToken();
  }
  return config;
});

// 2. If the access token expired, get a new one once and retry the request
let refreshing = null;

const refreshAccessToken = async () => {
  const refresh = findToken('refresh');
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

// Keeps older screens that use `import api from '../services/api'` working
export default api;
