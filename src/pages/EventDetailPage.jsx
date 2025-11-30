import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/event.service';
import { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';

const EventDetailPage = () => 
{
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy user
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false); // State loading cho nút đăng ký

  useEffect(() => 
    {
    const fetchEventDetail = async () => 
        {
            try 
            {
                const data = await eventService.getEventById(id);
                setEvent(data);
            } 
            catch (err) 
            {
                setError("Không tìm thấy sự kiện này.");
            } 
            finally 
            {
                setLoading(false);
            }
        };
    fetchEventDetail();
    }, 
        [id]);
        if (loading) return <div className="text-center py-20">Đang tải thông tin...</div>;
        if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
        if (!event) return null;

  const isFull = event.soLuongDaDangKy >= event.soLuongToiDa;

  // Hàm xử lý Đăng ký MỚI
  const handleRegister = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đăng ký!");
      navigate('/login');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn đăng ký sự kiện "${event.tenSuKien}"?`)) return;

    setRegistering(true);
    try {
      await eventService.registerEvent(event.eventId); // Gọi API thật
      alert("Đăng ký thành công!");
      // Tải lại thông tin sự kiện để cập nhật số lượng chỗ
      // fetchEventDetail(); 
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại. Có thể bạn đã đăng ký rồi.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-8">
      {/* 1. Ảnh bìa sự kiện */}
      <img 
        src={event.anhSuKienUrl} 
        alt={event.tenSuKien} 
        className="w-full h-80 object-cover"
      />

      <div className="p-8">
        {/* 2. Tiêu đề và Badge trạng thái */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.tenSuKien}</h1>
            <p className="text-blue-600 font-medium flex items-center gap-2">
              🏢 Tổ chức bởi: <span className="font-bold">{event.Club?.tenCLB || "CLB Sự Kiện"}</span>
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {isFull ? '🚫 Đã hết chỗ' : '✅ Đang mở đăng ký'}
          </div>
        </div>

        {/* 3. Grid thông tin chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Cột trái: Thông tin */}
          <div className="md:col-span-2 space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <span className="font-bold w-24">📅 Thời gian:</span>
              {new Date(event.thoiGianBatDau).toLocaleString('vi-VN')}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold w-24">📍 Địa điểm:</span>
              {event.diaDiem}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold w-24">👥 Số lượng:</span>
              <span>{event.soLuongDaDangKy} / {event.soLuongToiDa} người</span>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Mô tả sự kiện:</h3>
              <p className="leading-relaxed whitespace-pre-line text-gray-600">
                {event.moTa}
              </p>
            </div>
          </div>

          {/* Cột phải: Nút hành động */}
          <div className="flex flex-col justify-start items-center space-y-4">
            <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-4">Bạn có muốn tham gia?</p>
              
              <button 
                onClick={handleRegister}
                disabled={isFull || registering}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all transform shadow-md
                  ${isFull || registering 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-blue-200'
                  }`}
              >
                {registering ? '⏳ Đang xử lý...' : (isFull ? 'Sự kiện đã đầy' : 'Đăng Ký Ngay')}
              </button>

              {!user && (
                <p className="text-xs text-red-500 mt-2 italic">
                  * Vui lòng đăng nhập để đăng ký
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Nút quay lại */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors"
        >
          &larr; Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;