import api from './api';

const registrationService = {
  // Lấy báo cáo thống kê (Số lượng đăng ký, check-in)
  getReport: async (eventId) => {
    const response = await api.get(`/registrations/reports/${eventId}`);
    return response.data;
  },
  
  // (Các hàm check-in cũ nếu bạn đã xóa thì không cần thêm lại)
};

export default registrationService;