import api from './api';

// 1. Mock Data (Đã chuẩn hóa key 'club' chữ thường cho giống BE)
const MOCK_EVENTS = [
  {
    eventId: 1,
    tenSuKien: "Đêm nhạc Acoustic Mùa Thu",
    moTa: "Một đêm nhạc ấm cúng với những bản tình ca bất hủ.",
    thoiGianBatDau: "2025-11-20T19:00:00",
    thoiGianKetThuc: "2025-11-20T22:00:00", // Thêm kết thúc
    diaDiem: "Hội trường A",
    anhBiaUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    soLuongToiDa: 100,
    clubId: 1,
    club: { tenCLB: "CLB Guitar", logoUrl: "https://via.placeholder.com/50" }
  },
  {
    eventId: 2,
    tenSuKien: "Workshop: Kỹ năng Lập trình ReactJS",
    moTa: "Học cách xây dựng website hiện đại với React từ con số 0.",
    thoiGianBatDau: "2025-11-25T08:00:00",
    thoiGianKetThuc: "2025-11-25T11:00:00",
    diaDiem: "Phòng Lab 3",
    anhBiaUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    soLuongToiDa: 30,
    clubId: 2,
    club: { tenCLB: "CLB IT", logoUrl: "https://via.placeholder.com/50" }
  }
];

class EventService {
  // Lấy danh sách
  async getAllEvents() {
    try {
      const response = await api.get('/events');
      return response;
    } catch (error) {
      console.warn("API lỗi, dùng Mock Data:", error.message);
      return MOCK_EVENTS;
    }
  }

  // Lấy chi tiết
  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      return response;
    } catch (error) {
      console.warn("API lỗi, tìm trong Mock Data...");
      return MOCK_EVENTS.find(e => e.eventId === parseInt(id)) || null;
    }
  }

  // Tạo sự kiện (QUAN TRỌNG: Tách clubId để đưa vào URL)
  async createEvent(data) {
    const { clubId, ...eventData } = data;
    if (!clubId) throw new Error("Chưa chọn CLB!");
    // Gọi đúng route BE: POST /api/events/clubs/:clubId
    return api.post(`/events/clubs/${clubId}`, eventData);
  }

  // Cập nhật
  async updateEvent(id, data) {
    return api.put(`/events/${id}`, data);
  }

  // Xóa
  async deleteEvent(id) {
    return api.delete(`/events/${id}`);
  }
}

export default new EventService();