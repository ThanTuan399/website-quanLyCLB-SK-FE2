import api from './api';

const userService = {
  // 1. Lấy thông tin chi tiết của user (Dữ liệu thật từ Backend)
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // 2. Cập nhật thông tin user (Dữ liệu thật)
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // 3. Lấy lịch sử đăng ký sự kiện
  // (Nếu Backend chưa có API này, ta vẫn giữ Mock Data tạm thời
  // hoặc nếu Backend đã xong API 'GET /users/events', hãy uncomment dòng dưới)
  getMyRegistrations: async () => {
    // --- Dùng API thật (khi Backend đã sẵn sàng) ---
    // const response = await api.get('/users/events'); 
    // return response.data;
    
    // --- Tạm thời vẫn dùng Mock Data cho phần Lịch sử (vì BE có thể chưa làm kịp) ---
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        tenSuKien: "Đêm nhạc Acoustic Mùa Thu (Dữ liệu giả)",
        thoiGian: "2025-11-20T19:00:00",
        trangThai: "Đã đăng ký",
        diaDiem: "Hội trường A"
      },
    ];
  }
};

export default userService;