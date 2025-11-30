import api from './api';

// 1. Định nghĩa dữ liệu giả (Mock Data) bên ngoài Class
const MOCK_EVENTS = [
  {
    eventId: 1,
    tenSuKien: "Đêm nhạc Acoustic Mùa Thu",
    moTa: "Một đêm nhạc ấm cúng với những bản tình ca bất hủ.",
    thoiGianBatDau: "2025-11-20T19:00:00",
    diaDiem: "Hội trường A",
    anhSuKienUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    soLuongToiDa: 100,
    soLuongDaDangKy: 85, 
    Club: { tenCLB: "CLB Guitar", logoUrl: "https://via.placeholder.com/50" }
  },
  {
    eventId: 2,
    tenSuKien: "Workshop: Kỹ năng Lập trình ReactJS",
    moTa: "Học cách xây dựng website hiện đại với React từ con số 0.",
    thoiGianBatDau: "2025-11-25T08:00:00",
    diaDiem: "Phòng Lab 3",
    anhSuKienUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    soLuongToiDa: 30,
    soLuongDaDangKy: 30, 
    Club: { tenCLB: "CLB IT", logoUrl: "https://via.placeholder.com/50" }
  }
];

// 2. Định nghĩa Class Service theo cấu trúc OOP
class EventService {

  // Lấy danh sách tất cả sự kiện
  async getAllEvents() {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.warn("Chưa kết nối được API Events, dùng dữ liệu giả...");
      // ✅ Sửa lỗi Logic: Trả về Mock Data thay vì mảng rỗng
      return MOCK_EVENTS;
    }
  }

  // Lấy chi tiết một sự kiện
  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Chưa kết nối được API chi tiết sự kiện ${id}, dùng dữ liệu giả...`);
      
      // ✅ Sửa lỗi Logic: Trả về Mock Data thay vì ném lỗi (throw error)
      const event = MOCK_EVENTS.find(e => e.eventId === parseInt(id));
      return event || null; // Trả về sự kiện hoặc null nếu không tìm thấy ID
    }
  }

  // Đăng ký tham gia sự kiện
  async registerEvent(eventId) {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  }

  // Tạo sự kiện mới
  async createEvent(clubId, eventData) {
    const response = await api.post(`/events/clubs/${clubId}`, eventData);
    return response.data;
  }

  // Xóa sự kiện
  async deleteEvent(eventId) {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  }
}

// 3. Khởi tạo một instance duy nhất và export nó
export default new EventService();