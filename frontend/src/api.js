import axios from 'axios';


console.log(import.meta.env.VITE_BACKEND_URL);

const api = axios.create({
  baseURL: 'https://truckerandshippers.onrender.com/', // ✅ Vite handles env variables like this
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
