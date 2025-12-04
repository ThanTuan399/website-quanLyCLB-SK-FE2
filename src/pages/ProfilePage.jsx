import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import Modal from '../components/common/Modal';

// Helper format ngày đơn giản
const formatDate = (isoString) => {
    if (!isoString) return 'Chưa cập nhật';
    return new Date(isoString).toLocaleDateString('vi-VN');
};

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State form dữ liệu
    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        lop: '',
        avatarUrl: ''
    });

    // Fill dữ liệu từ Context vào Form khi mở Modal
    useEffect(() => {
        if (user) {
            setFormData({
                hoTen: user.hoTen || user.fullName || '',
                soDienThoai: user.soDienThoai || user.phone || '',
                lop: user.lop || user.class || '',
                avatarUrl: user.avatarUrl || user.hinhAnh || ''
            });
        }
    }, [user, isModalOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Gọi API
            const response = await userService.updateProfile(formData);
            
            // 2. Xử lý kết quả trả về
            // Backend thường trả về: { message: "...", user: { ...thông tin mới... } }
            // Hoặc nếu Backend trả thẳng object user thì dùng response
            const newUserInfo = response.user || response;

            // 3. Cập nhật Context
            updateUser(newUserInfo);

            alert("Cập nhật hồ sơ thành công!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div className="p-10 text-center">Vui lòng đăng nhập...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* --- CARD PROFILE --- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                
                {/* Ảnh bìa (Header trang trí) */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                <div className="px-8 pb-8">
                    {/* Avatar & Tên & Nút Sửa */}
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end">
                            <img 
                                src={user.avatarUrl || user.hinhAnh || `https://ui-avatars.com/api/?name=${user.hoTen}&background=random`} 
                                alt="Avatar" 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover"
                            />
                            <div className="ml-4 mb-2">
                                <h1 className="text-2xl font-bold text-gray-800">{user.hoTen || user.fullName}</h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Chỉnh sửa
                        </button>
                    </div>

                    {/* Thông tin chi tiết (Grid Layout) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t pt-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mã số sinh viên</label>
                            <p className="font-semibold text-gray-800 text-lg">{user.mssv || "Chưa cập nhật"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lớp sinh hoạt</label>
                            <p className="font-semibold text-gray-800 text-lg">{user.lop || user.class || "Chưa cập nhật"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                            <p className="font-semibold text-gray-800 text-lg">{user.soDienThoai || user.phone || "Chưa cập nhật"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vai trò</label>
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                user.vaiTro === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {user.vaiTro || "SINH VIÊN"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL EDIT FORM --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Cập nhật Hồ Sơ Cá Nhân"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                            type="text" name="hoTen"
                            value={formData.hoTen} onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* SĐT & Lớp */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text" name="soDienThoai"
                                value={formData.soDienThoai} onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                            <input
                                type="text" name="lop"
                                value={formData.lop} onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh đại diện</label>
                        <input
                            type="text" name="avatarUrl"
                            value={formData.avatarUrl} onChange={handleInputChange}
                            placeholder="https://example.com/my-photo.jpg"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Gợi ý: Upload ảnh lên Facebook/Imgur rồi copy link dán vào đây.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 text-white bg-blue-600 rounded-lg transition font-medium ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProfilePage;