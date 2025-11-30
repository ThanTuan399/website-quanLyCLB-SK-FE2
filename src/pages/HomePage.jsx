import { useState, useEffect } from 'react';
import eventService from '../services/event.service';
import EventCard from '../components/common/EventCard';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        //const data = await eventService.getAllEvents();
        //setEvents(data); // Lưu dữ liệu lấy được vào state
        // Tạo dữ liệu giả
        const mockData = [
          {
            eventId: 1,
            tenSuKien: "Đêm nhạc Acoustic Mùa Thu",
            moTa: "Một đêm nhạc ấm cúng với những bản tình ca bất hủ.",
            thoiGianBatDau: "2025-11-20T19:00:00",
            diaDiem: "Hội trường A",
            anhSuKienUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=500&q=60",
            Club: { tenCLB: "CLB Guitar" }
          },
          {
            eventId: 2,
            tenSuKien: "Workshop: Kỹ năng Lập trình ReactJS",
            moTa: "Học cách xây dựng website hiện đại với React từ con số 0.",
            thoiGianBatDau: "2025-11-25T08:00:00",
            diaDiem: "Phòng Lab 3",
            anhSuKienUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=60",
            Club: { tenCLB: "CLB IT" }
          }
        ];

        // Giả vờ đợi 1 giây cho giống thật
        setTimeout(() => {
          setEvents(mockData);
          setLoading(false);
        }, 1000);
        // ----------------------------------------------------
      } catch (err) {
        console.error("Lỗi tải sự kiện:", err);
        setError("Không thể tải danh sách sự kiện. Vui lòng thử lại sau.");
      } finally {
        setLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải sự kiện...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      {/* Banner chào mừng */}
      <div className="bg-blue-100 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Cổng thông tin Sự kiện & CLB</h1>
        <p className="text-gray-700">Khám phá và tham gia các hoạt động sinh viên sôi nổi nhất!</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3">
        Sự kiện sắp diễn ra
      </h2>

      {/* Lưới sự kiện */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Chưa có sự kiện nào.</p>
      )}
    </div>
  );
};

export default HomePage;