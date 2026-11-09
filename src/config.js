// biashara-ai/src/config.js
import axios from 'axios';

// Get URL from Vite env or fallback to Render backend
let rawUrl = import.meta.env.VITE_API_URL || 'https://duka-poa.onrender.com';

// Clean up trailing slashes or accidental duplicate paths
rawUrl = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const API_BASE_URL = rawUrl;

// Configure global Axios settings
axios.defaults.timeout = 45000; // 45 seconds to accommodate Render free-tier cold starts

export default API_BASE_URL;
