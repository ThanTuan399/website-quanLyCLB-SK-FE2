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
    chuNhiemId: '', // Sẽ nhập ID user hoặc chọn từ dropdown (tạm thời nhập số)
    logoUrl: '',
    anhBiaUrl: ''
  });

  // 1. Load danh sách CLB
  const fetchClubs = async () => {
    try {
      const data = await clubService.getAllClubs();
      setClubs(data);
    } catch (error) {
      console.error("Lỗi tải CLB:", error);
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
        tenCLB: club.tenCLB,
        moTa: club.moTa,
        chuNhiemId: club.chuNhiemId || '',
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
        // Gọi API Sửa
        await clubService.updateClub(editingClub.id, formData); // Lưu ý: check lại BE trả về id hay clubId
        alert("Cập nhật thành công!");
      } else {
        // Gọi API Thêm
        await clubService.createClub(formData);
        alert("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      fetchClubs(); // Load lại bảng
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Có lỗi xảy ra"));
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa CLB này?")) {
      try {
        await clubService.deleteClub(id);
        alert("Đã xóa!");
        fetchClubs();
      } catch (error) {
        alert("Lỗi xóa: " + error.message);
      }
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;

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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Tên CLB</th>
              <th className="py-3 px-6 text-left">Chủ Nhiệm (ID)</th>
              <th className="py-3 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {clubs.map((club) => (
              <tr key={club.id || club.clubId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap font-bold">{club.id || club.clubId}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    {club.logoUrl && (
                      <img src={club.logoUrl} alt="logo" className="w-8 h-8 rounded-full mr-2 object-cover border" />
                    )}
                    <span>{club.tenCLB}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{club.manager?.hoTen || club.chuNhiemId}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(club)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(club.id || club.clubId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clubs.length === 0 && <div className="text-center py-4">Chưa có CLB nào.</div>}
      </div>

      {/* MODAL FORM */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingClub ? "Chỉnh Sửa CLB" : "Thêm CLB Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Tên CLB</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              value={formData.tenCLB}
              onChange={(e) => setFormData({...formData, tenCLB: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Mô tả</label>
            <textarea 
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              rows="3"
              value={formData.moTa}
              onChange={(e) => setFormData({...formData, moTa: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">ID Chủ Nhiệm</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 px-3 py-2 rounded"
                value={formData.chuNhiemId}
                onChange={(e) => setFormData({...formData, chuNhiemId: e.target.value})}
                required
              />
              <small className="text-gray-500">Nhập ID của User (VD: 1, 2)</small>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Link Logo</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 px-3 py-2 rounded"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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