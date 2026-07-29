import axios from 'axios';
import { mostrarToast } from './toastStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmacia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem('farmacia_token');
      localStorage.removeItem('farmacia_usuario');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!esLogin) {
      const mensaje = error.response?.data?.mensaje || 'Ocurrió un error inesperado';
      mostrarToast(mensaje, 'error');
    }

    return Promise.reject(error);
  }
);

export default api;