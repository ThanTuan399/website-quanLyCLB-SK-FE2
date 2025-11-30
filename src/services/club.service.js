import api from './api';

const clubService = {
  // Lấy danh sách tất cả CLB
  getAllClubs: async () => {
    const response = await api.get('/clubs');
    return response.data;
  },

  // Tạo CLB mới (Dữ liệu gửi lên là JSON)
  createClub: async (clubData) => {
    const response = await api.post('/clubs', clubData);
    return response.data;
  },

  // Xóa CLB
  deleteClub: async (clubId) => {
    const response = await api.delete(`/clubs/${clubId}`);
    return response.data;
  }
};

export default clubService;