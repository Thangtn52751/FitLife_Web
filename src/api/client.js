import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  if (cfg.method === 'post') {
    cfg.data = {
      ...(cfg.data || {}),
      type: 'reset-password',
    };
  }

  return cfg;
});

export default client;
