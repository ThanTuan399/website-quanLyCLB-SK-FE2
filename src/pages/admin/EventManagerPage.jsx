import React, { useState, useEffect } from 'react';
import eventService from '../../services/event.service';
import clubService from '../../services/club.service';
import Modal from '../../components/common/Modal'; // Đảm bảo bạn đã có file này
import { formatDate } from '../../utils/formatDate'; // Nếu chưa có thì hiển thị string thô cũng được

const EventManagerPage = () => {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    tenSuKien: '',
    moTa: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    diaDiem: '',
    soLuongToiDa: 0,
    anhBiaUrl: '',
    clubId: ''
  });

  // --- API CALLS ---
  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  
  // Helper: Format ngày từ ISO sang YYYY-MM-DDTHH:mm cho input
  const formatForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Trick: Trừ timezone offset để toISOString ra đúng giờ local
    const tzOffset = date.getTimezoneOffset() * 60000; 
    return (new Date(date - tzOffset)).toISOString().slice(0, 16);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      // Chế độ Sửa
      setEditingEvent(event);
      setFormData({
        tenSuKien: event.tenSuKien || '',
        moTa: event.moTa || '',
        thoiGianBatDau: formatForInput(event.thoiGianBatDau),
        thoiGianKetThuc: formatForInput(event.thoiGianKetThuc),
        diaDiem: event.diaDiem || '',
        soLuongToiDa: event.soLuongToiDa || 100,
        anhBiaUrl: event.anhBiaUrl || '',
        clubId: event.clubId || (event.club ? event.club.id : '')
      });
    } else {
      // Chế độ Thêm mới
      setEditingEvent(null);
      setFormData({
        tenSuKien: '', moTa: '', thoiGianBatDau: '', thoiGianKetThuc: '',
        diaDiem: '', soLuongToiDa: 100, anhBiaUrl: '',
        clubId: clubs.length > 0 ? clubs[0].id : '' // Default chọn CLB đầu tiên
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Gọi API Update (Lưu ý: dùng id hay eventId tùy mock/real data)
        const id = editingEvent.id || editingEvent.eventId; 
        await eventService.updateEvent(id, formData);
        alert("Cập nhật thành công!");
      } else {
        // Gọi API Create
        await eventService.createEvent(formData);
        alert("Tạo mới thành công!");
      }
      setIsModalOpen(false);
      fetchData(); // Load lại bảng
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await eventService.deleteEvent(id);
      fetchData();
    } catch (error) {
      alert("Xóa thất bại! Kiểm tra quyền hạn.");
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải danh sách...</div>;

  return (
    <div className="p-6">
      {/* --- Header & Button --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sự kiện</h1>
        <button 
          onClick={() => handleOpenModal(null)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow"
        >
          + Tạo Sự kiện Mới
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id || event.eventId} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    {/* Hiển thị ảnh nhỏ nếu có */}
                    {event.anhBiaUrl && (
                        <img src={event.anhBiaUrl} alt="" className="w-10 h-10 rounded object-cover mr-3 hidden sm:block"/>
                    )}
                    <div>
                        <p className="text-gray-900 font-bold">{event.tenSuKien}</p>
                        <p className="text-gray-400 text-xs truncate max-w-xs">{event.moTa}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {/* Xử lý hiển thị an toàn nếu club null */}
                    {event.club ? (event.club.tenCLB || event.club.name) : "N/A"}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {/* Format ngày tháng nếu có hàm helper, ko thì dùng toLocaleDateString */}
                    {new Date(event.thoiGianBatDau).toLocaleDateString('vi-VN')} <br/>
                    <span className="text-xs text-gray-500">
                        {new Date(event.thoiGianBatDau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(event)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id || event.eventId)} 
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && !loading && (
            <div className="p-6 text-center text-gray-500">Chưa có sự kiện nào.</div>
        )}
      </div>

      {/* --- MODAL FORM --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Cập Nhật Sự Kiện" : "Thêm Sự Kiện Mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tên sự kiện</label>
                <input type="text" name="tenSuKien" required
                    value={formData.tenSuKien} onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">CLB Tổ chức</label>
                    <select name="clubId" required
                        value={formData.clubId} onChange={handleInputChange}
                        className="mt-1 w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="">-- Chọn CLB --</option>
                        {clubs.map(c => (
                            <option key={c.id || c.clubId} value={c.id || c.clubId}>
                                {c.tenCLB || c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng Max</label>
                    <input type="number" name="soLuongToiDa" required
                        value={formData.soLuongToiDa} onChange={handleInputChange}
                        className="mt-1 w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bắt đầu</label>
                    <input type="datetime-local" name="thoiGianBatDau" required
                        value={formData.thoiGianBatDau} onChange={handleInputChange}
                        className="mt-1 w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kết thúc</label>
                    <input type="datetime-local" name="thoiGianKetThuc" required
                        value={formData.thoiGianKetThuc} onChange={handleInputChange}
                        className="mt-1 w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <input type="text" name="diaDiem" required
                    value={formData.diaDiem} onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Link Ảnh bìa</label>
                <input type="text" name="anhBiaUrl" placeholder="https://..."
                    value={formData.anhBiaUrl} onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea name="moTa" rows="3"
                    value={formData.moTa} onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2"
                ></textarea>
            </div>

            <div className="flex justify-end pt-4 gap-3 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >Hủy</button>
                <button type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                >{editingEvent ? "Lưu Thay Đổi" : "Tạo Mới"}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventManagerPage;