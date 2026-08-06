import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app') || host.includes('loca.lt')) {
      return 'https://library-backend-api.loca.lt/api/v1';
    }
    return `http://${host}:8080/api/v1`;
  }
  return 'https://library-backend-api.loca.lt/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

api.interceptors.request.use((config) => {
  const currentBaseUrl = getBaseUrl();
  config.baseURL = currentBaseUrl;
  return config;
});

export default api;
