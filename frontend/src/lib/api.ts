import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app') || host.includes('loca.lt') || host.includes('lhr.life')) {
      return 'https://library-universe-api-v1.loca.lt/api/v1';
    }
    return `http://${host}:8080/api/v1`;
  }
  return 'https://library-universe-api-v1.loca.lt/api/v1';
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

  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const authData = localStorage.getItem('library-auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          token = parsed?.state?.token || parsed?.state?.user?.token || parsed?.state?.user?.jwt;
        }
      } catch {
        // fallback
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
