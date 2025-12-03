// 

// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// import authService from '../services/auth.service'; // Tạm thời comment lại

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // --- MOCK DATA: Giả vờ đã đăng nhập với quyền ADMIN ---
    const mockUser = {
        userId: 1,
        hoTen: "Admin Giả Lập",
        email: "admin@mock.com",
        avatarUrl: "https://i.pravatar.cc/150?img=3", // Ảnh ngẫu nhiên
        vaiTro: "ADMIN", // Để vào được trang Admin
        isManager: true
    };

    // Set user mặc định là mockUser luôn (thay vì null)
    const [user, setUser] = useState(mockUser); 
    const [loading, setLoading] = useState(false); // Set false luôn để không phải chờ

    /* --- TẠM THỜI COMMENT ĐOẠN CHECK LOGIN THẬT NÀY LẠI ---
    useEffect(() => {
        const checkLogin = async () => { ... };
        checkLogin();
    }, []);
    */

    // Hàm login giả (để test trang Login)
    const login = async (email, password) => {
        // Không gọi API thật nữa
        console.log("Đăng nhập giả với:", email, password);
        setUser(mockUser);
        return { user: mockUser, token: "fake-token-123" };
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // window.location.href = '/login'; // Tạm tắt reload để debug dễ hơn
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);