// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // QUAN TRỌNG: Port 3000 khớp với Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Interceptor gửi đi (Gắn Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Interceptor nhận về (Xử lý data & Lỗi 401)
api.interceptors.response.use(
    (response) => {
        // Trả về data gọn gàng
        return response.data;
    },
    (error) => {
        // Nếu lỗi 401 (Hết phiên đăng nhập)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Chỉ redirect nếu chưa ở trang login để tránh lặp vô tận
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
                // alert('Phiên đăng nhập hết hạn'); // Có thể bật lại nếu muốn thông báo
            }
        }
        return Promise.reject(error);
    }
);

export default api;