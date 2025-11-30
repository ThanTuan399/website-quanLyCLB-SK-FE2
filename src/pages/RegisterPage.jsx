import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Quản lý dữ liệu form
  const [formData, setFormData] = useState({
    hoTen: '',
    mssv: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hàm xử lý khi nhấn nút Đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      // 2. Gọi API Đăng ký (Chuẩn bị dữ liệu đúng tên trường Backend cần)
      const dataToSend = {
        hoTen: formData.hoTen,
        mssv: formData.mssv,
        email: formData.email,
        matKhau: formData.password // Backend dùng 'matKhau'
      };

      await authService.register(dataToSend);
      
      // 3. Thành công -> Chuyển hướng sang trang đăng nhập
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');

    } catch (err) {
      // Hiển thị lỗi từ Backend (ví dụ: Email đã tồn tại)
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng Ký Tài Khoản</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Họ và Tên */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">Họ và Tên</label>
            <input 
              type="text" name="hoTen"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.hoTen} onChange={handleChange} required
            />
          </div>

          {/* Mã số sinh viên */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">Mã số sinh viên (MSSV)</label>
            <input 
              type="text" name="mssv"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.mssv} onChange={handleChange} required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">Email</label>
            <input 
              type="email" name="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email} onChange={handleChange} required
            />
          </div>
          
          {/* Mật khẩu */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">Mật khẩu</label>
            <input 
              type="password" name="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.password} onChange={handleChange} required
            />
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm">Nhập lại mật khẩu</label>
            <input 
              type="password" name="confirmPassword"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.confirmPassword} onChange={handleChange} required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;