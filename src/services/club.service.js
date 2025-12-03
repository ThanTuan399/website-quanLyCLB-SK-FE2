import api from './api';

const clubService = {
  // 1. Lấy danh sách (Có sẵn)
  getAllClubs: async () => {
    return api.get('/clubs');
  },

  // 2. Tạo mới (Cần thêm)
  createClub: async (clubData) => {
    // Payload: { tenCLB, moTa, chuNhiemId, ... }
    return api.post('/clubs', clubData);
  },

  // 3. Cập nhật (Cần thêm)
  updateClub: async (clubId, clubData) => {
    return api.put(`/clubs/${clubId}`, clubData);
  },

  // 4. Xóa (Cần thêm)
  deleteClub: async (clubId) => {
    return api.delete(`/clubs/${clubId}`);
  }
};

export default clubService;