import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/user.service';

const ProfilePage = () => {
  const { user } = useContext(AuthContext); // Lấy user từ Context (đã đăng nhập)
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách sự kiện đã đăng ký (Mock data)
        const events = await userService.getMyRegistrations();
        setMyEvents(events);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) return <div className="text-center py-10">Vui lòng đăng nhập để xem hồ sơ.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột 1: Thông tin cá nhân */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img 
              src={user.avatarUrl || "https://via.placeholder.com/150"} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
            />
            <h2 className="text-xl font-bold text-gray-800">{user.hoTen}</h2>
            <p className="text-gray-500 mb-4">{user.vaiTro}</p>
            
            <div className="text-left space-y-3 border-t pt-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
                <p className="text-gray-700 break-words">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">MSSV</label>
                <p className="text-gray-700">{user.mssv || "Chưa cập nhật"}</p>
              </div>
            </div>

            <button className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition text-sm font-medium">
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>

        {/* Cột 2: Lịch sử tham gia (Chiếm 2 phần) */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Lịch sử tham gia sự kiện</h3>
            
            {loading ? (
              <p>Đang tải...</p>
            ) : myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-blue-50 transition">
                    <div>
                      <h4 className="font-bold text-blue-700">{event.tenSuKien}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.thoiGian).toLocaleDateString('vi-VN')} tại {event.diaDiem}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.trangThai === 'Đã đăng ký' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.trangThai}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">Bạn chưa đăng ký sự kiện nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;