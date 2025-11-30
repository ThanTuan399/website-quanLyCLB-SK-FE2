// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Địa chỉ Backend bạn vừa làm xong
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm Token vào mỗi yêu cầu nếu có (sẽ dùng ở các bước sau)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;