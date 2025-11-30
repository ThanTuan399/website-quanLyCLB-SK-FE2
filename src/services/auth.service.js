import api from './api';

const authService = {
  // Gửi yêu cầu đăng nhập
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, matKhau: password });
    return response.data; // Trả về dữ liệu từ Backend (token, user info)
  },

  // Gửi yêu cầu đăng ký
  register: async (userData) => {
    // userData bao gồm: hoTen, email, matKhau, mssv
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Lấy thông tin user hiện tại (dùng token đã lưu)
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};

export default authService;