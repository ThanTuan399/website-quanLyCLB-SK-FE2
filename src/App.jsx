import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Đã import thì phải dùng!

// Layouts
import MainLayout from './layouts/MainLayout'; 
import AdminLayout from './layouts/AdminLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import HomePage from './pages/HomePage'; 
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ClubManagerPage from './pages/admin/ClubManagerPage';
import EventReportPage from './pages/admin/EventReportPage';
import EventManagerPage from './pages/admin/EventManagerPage';

import EventsPage from './pages/public/EventsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* --- PUBLIC ROUTES (Ai cũng vào được) --- */}
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} /> 
          
          <Route path="/" element={<MainLayout> <HomePage/> </MainLayout>} />
          <Route path="/events" element={ <MainLayout> <EventsPage /> </MainLayout>} />
          <Route path="/events/:id" element={<MainLayout> <EventDetailPage /> </MainLayout>} />


          {/* --- PROTECTED ROUTES (Phải đăng nhập mới vào được) --- */}

          {/* 1. Trang Profile: Dành cho Sinh viên, Manager, Admin */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'MANAGER', 'ADMIN']} />}>
             <Route path="/profile" element={ <MainLayout> <ProfilePage /> </MainLayout>} />
          </Route>


          {/* 2. KHU VỰC ADMIN: Chỉ dành cho Admin và Manager */}
          {/* Bọc toàn bộ route /admin bằng ProtectedRoute */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  
                  {/* Đã sửa lỗi cú pháp dư dấu { } ở dòng này */}
                  <Route path="clubs" element={<ClubManagerPage />} />
                  
                  <Route path="reports/:id" element={<EventReportPage />} />
                  <Route path="events" element={<EventManagerPage />} />
                  
                  <Route index element={<div className="p-4">Chào mừng Admin! Hãy chọn menu bên trái.</div>} />
              </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;