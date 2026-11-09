import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://duka-poa.onrender.com';

// Configure default axios timeout to handle mobile latency gracefully
axios.defaults.timeout = 45000; // 45 seconds

export default API_BASE_URL;
