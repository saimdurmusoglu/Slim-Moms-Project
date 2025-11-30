import axios from 'axios';
import { store } from '../redux/store'; // Store'a doğrudan erişeceğiz

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// --- TOKEN EKLEME INTERCEPTOR'I ---
// Her istek atılmadan HEMEN ÖNCE bu fonksiyon çalışır
instance.interceptors.request.use(
  (config) => {
    // Redux store'dan güncel state'i al
    const state = store.getState();
    const token = state.auth.token;

    // Eğer token varsa başlığa ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Eski yardımcı fonksiyonlar (geriye uyumluluk için kalsın ama artık pek gerek yok)
export const setToken = (token) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearToken = () => {
  instance.defaults.headers.common.Authorization = '';
};