// // 

// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// // import authService from '../services/auth.service'; // Tạm thời comment lại

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     // --- MOCK DATA: Giả vờ đã đăng nhập với quyền ADMIN ---
//     const mockUser = {
//         userId: 1,
//         hoTen: "Admin Giả Lập",
//         email: "admin@mock.com",
//         avatarUrl: "https://i.pravatar.cc/150?img=3", // Ảnh ngẫu nhiên
//         vaiTro: "ADMIN", // Để vào được trang Admin
//         isManager: true
//     };

//     // Set user mặc định là mockUser luôn (thay vì null)
//     const [user, setUser] = useState(mockUser); 
//     const [loading, setLoading] = useState(false); // Set false luôn để không phải chờ

//     /* --- TẠM THỜI COMMENT ĐOẠN CHECK LOGIN THẬT NÀY LẠI ---
//     useEffect(() => {
//         const checkLogin = async () => { ... };
//         checkLogin();
//     }, []);
//     */

//     // Hàm login giả (để test trang Login)
//     const login = async (email, password) => {
//         // Không gọi API thật nữa
//         console.log("Đăng nhập giả với:", email, password);
//         setUser(mockUser);
//         return { user: mockUser, token: "fake-token-123" };
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         setUser(null);
//         // window.location.href = '/login'; // Tạm tắt reload để debug dễ hơn
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {children} 
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import api để gọi check login thật nếu cần

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo state user từ localStorage nếu có (để giữ đăng nhập khi F5)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [loading, setLoading] = useState(false); // Tạm tắt loading để demo mock

    // --- Hàm Login ---
    const login = async (email, matKhau) => {
        // Demo logic: Gọi API thật ở đây
        // const res = await authService.login(email, matKhau);
        // setUser(res.user);
        // localStorage.setItem('token', res.token);
        // localStorage.setItem('user', JSON.stringify(res.user));
    };

    // --- Hàm Logout ---
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    // --- HÀM MỚI: Cập nhật User State (Quan trọng cho ProfilePage) ---
    const updateUser = (newUserData) => {
        setUser((prevUser) => {
            // Gộp thông tin cũ và mới để đảm bảo không mất các trường quan trọng (như token, role...)
            const updatedUser = { ...prevUser, ...newUserData };
            
            // Cập nhật luôn vào LocalStorage để F5 không bị mất thay đổi
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);