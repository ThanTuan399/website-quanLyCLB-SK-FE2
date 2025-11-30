import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import HomePage from './pages/HomePage'; 
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';

import DashboardPage from './pages/admin/DashboardPage';
import ClubManagerPage from './pages/admin/ClubManagerPage';
import EventReportPage from './pages/admin/EventReportPage';
import EventManagerPage from './pages/admin/EventManagerPage';

import EventsPage from './pages/public/EventsPage';


import MainLayout from './layouts/MainLayout'; 
import AdminLayout from './layouts/AdminLayout';




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Đường dẫn công khai */}
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} /> 
          
          {/* Trang chủ */}
          <Route path="/" element={<MainLayout> <HomePage/> </MainLayout>} />

          {/* 2. THÊM DÒNG NÀY VÀO: */}
          <Route path="/events" element={ <MainLayout> <EventsPage /> </MainLayout>} />

          {/* Thêm Route mới cho trang chi tiết. :id là tham số động */}
          <Route path="/events/:id" element={<MainLayout> <EventDetailPage /> </MainLayout>} />

          {/* Thêm Route Hồ sơ cá nhân */}
          <Route path="/profile" element={ <MainLayout> <ProfilePage /> </MainLayout>} />


          {/* --- KHU VỰC ADMIN --- */}
          {/* Mọi đường dẫn bắt đầu bằng /admin sẽ dùng AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>

          {/* Khi vào /admin/dashboard -> Hiển thị DashboardPage vào vị trí Outlet */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Sau này sẽ thêm: */}
          { <Route path="clubs" element={<ClubManagerPage />} />}

          {/* Route Báo cáo: Cần ID sự kiện để biết báo cáo cho cái nào */}
          <Route path="reports/:id" element={<EventReportPage />} />

          {/* THÊM DÒNG NÀY: */}
          <Route path="events" element={<EventManagerPage />} />

          {/* Nếu vào /admin mà không gõ gì thêm, tự chuyển sang dashboard (Tùy chọn) */}
          <Route index element={<div className="p-4">Chào mừng Admin! Hãy chọn menu bên trái.</div>} />
        </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
// Update deploy v1