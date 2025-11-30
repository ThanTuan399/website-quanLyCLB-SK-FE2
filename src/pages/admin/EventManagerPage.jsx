import { useState, useEffect } from 'react';
import eventService from '../../services/event.service';
import clubService from '../../services/club.service'; // Cần để lấy Club list

const EventManagerPage = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]); // Danh sách CLB cho Form
  const [loading, setLoading] = useState(true);

  // Gọi đồng thời cả Events và Clubs
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, clubsData] = await Promise.all([
        eventService.getAllEvents(),
        clubService.getAllClubs()
      ]);
      
      setEvents(eventsData);
      setClubs(clubsData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xử lý Xóa
  const handleDelete = async (eventId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;
    try {
      await eventService.deleteEvent(eventId);
      // Tải lại danh sách sau khi xóa
      fetchData(); 
    } catch (error) {
      alert("Xóa thất bại! Vui lòng kiểm tra quyền hạn.");
      console.error(error);
    }
  };

  if (loading) return <div>Đang tải danh sách sự kiện...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sự kiện</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Tạo Sự kiện Mới
        </button>
      </div>

      {/* Bảng danh sách Sự kiện */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên Sự kiện
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CLB Tổ chức
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-bold">{event.tenSuKien}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {event.club?.tenCLB || "Không xác định"}
                  </p>
                </td>
                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(event.thoiGianBatDau).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-3">
                  <button className="text-blue-600 hover:text-blue-900">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(event.eventId)} className="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManagerPage;