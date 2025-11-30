import { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin user
  const [loading, setLoading] = useState(true); // Trạng thái tải trang

  // Kiểm tra xem user đã đăng nhập trước đó chưa khi F5 trang
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token'); // Token lỗi thì xóa đi
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // Hàm Đăng nhập
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token); // Lưu token vào trình duyệt
    setUser(data.user); // Lưu user vào state
    return data;
  };

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};