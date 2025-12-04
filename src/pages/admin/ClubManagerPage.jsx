import React, { useEffect, useState } from 'react';
import clubService from '../../services/club.service';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

const ClubManagerPage = () => {
  const { user } = useAuth(); // Lấy user để gắn ID chủ nhiệm tự động nếu cần
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal và Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null); // Nếu null -> Thêm mới, Ngược lại -> Sửa
  
  const [formData, setFormData] = useState({
    tenCLB: '',
    moTa: '',
    chuNhiemId: '', 
    logoUrl: '',
    anhBiaUrl: ''
  });

  // 1. Load danh sách CLB
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await clubService.getAllClubs();
      // Kiểm tra kỹ dữ liệu trả về để set state đúng (đề phòng BE trả về object {data: []})
      setClubs(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error("Lỗi tải CLB:", error);
      alert("Không tải được danh sách CLB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // 2. Xử lý mở Modal (Thêm hoặc Sửa)
  const handleOpenModal = (club = null) => {
    if (club) {
      // Chế độ Sửa
      setEditingClub(club);
      setFormData({
        tenCLB: club.tenCLB || '',
        moTa: club.moTa || '',
        chuNhiemId: club.chuNhiemId || club.manager?.id || '',
        logoUrl: club.logoUrl || '',
        anhBiaUrl: club.anhBiaUrl || ''
      });
    } else {
      // Chế độ Thêm Mới
      setEditingClub(null);
      setFormData({
        tenCLB: '',
        moTa: '',
        chuNhiemId: user?.userId || '', // Gợi ý ID của người đang login
        logoUrl: '',
        anhBiaUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClub) {
        // --- SỬA LOGIC QUAN TRỌNG Ở ĐÂY ---
        // Lấy ID an toàn: ưu tiên id, nếu không có thì lấy clubId
        const id = editingClub.id || editingClub.clubId; 
        
        if (!id) {
            alert("Lỗi: Không tìm thấy ID của CLB cần sửa!");
            return;
        }

        await clubService.updateClub(id, formData);
        alert("Cập nhật thành công!");
      } else {
        // Gọi API Thêm
        await clubService.createClub(formData);
        alert("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      fetchClubs(); // Load lại bảng
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.message || "Có lỗi xảy ra"));
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    if (!id) return;
    
    // Thêm cảnh báo chi tiết hơn
    const confirmMsg = "CẢNH BÁO: Bạn có chắc chắn muốn xóa CLB này?\nViệc này sẽ xóa tất cả Thành viên và Sự kiện thuộc CLB!";
    
    if (window.confirm(confirmMsg)) {
      try {
        await clubService.deleteClub(id);
        alert("Đã xóa CLB!");
        fetchClubs();
      } catch (error) {
        console.error("Lỗi xóa:", error);
        alert("Lỗi xóa: " + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Câu Lạc Bộ</h1>
        <button 
          onClick={() => handleOpenModal(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Thêm CLB Mới
        </button>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left font-bold">ID</th>
              <th className="py-3 px-6 text-left font-bold">Tên CLB</th>
              <th className="py-3 px-6 text-left font-bold">Chủ Nhiệm (ID)</th>
              <th className="py-3 px-6 text-center font-bold">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {clubs.map((club) => {
                // Xác định ID hiển thị để dùng nhiều lần
                const currentId = club.id || club.clubId;
                
                return (
                  <tr key={currentId} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-bold">{currentId}</td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        {club.logoUrl && (
                          <img src={club.logoUrl} alt="logo" className="w-10 h-10 rounded-full mr-3 object-cover border shadow-sm" />
                        )}
                        <span className="text-base font-medium text-gray-800">{club.tenCLB}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                        {/* Hiển thị ID chủ nhiệm, nếu có object manager thì hiện tên cho đẹp */}
                        {club.manager ? `${club.manager.hoTen} (${club.chuNhiemId})` : club.chuNhiemId}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        <button 
                          onClick={() => handleOpenModal(club)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(currentId)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
        {clubs.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 text-lg">Chưa có Câu lạc bộ nào.</div>
        )}
      </div>

      {/* MODAL FORM */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingClub ? "Chỉnh Sửa CLB" : "Thêm CLB Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Tên CLB <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={formData.tenCLB}
              onChange={(e) => setFormData({...formData, tenCLB: e.target.value})}
              required
              placeholder="Ví dụ: CLB Guitar"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Mô tả</label>
            <textarea 
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows="3"
              value={formData.moTa}
              onChange={(e) => setFormData({...formData, moTa: e.target.value})}
              placeholder="Mô tả ngắn về hoạt động..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">ID Chủ Nhiệm <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                value={formData.chuNhiemId}
                onChange={(e) => setFormData({...formData, chuNhiemId: e.target.value})}
                required
                placeholder="Nhập ID User"
              />
              <small className="text-gray-500 text-xs">Điền ID của người quản lý</small>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Link Logo</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
            >
              {editingClub ? "Lưu Thay Đổi" : "Tạo Mới"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubManagerPage;