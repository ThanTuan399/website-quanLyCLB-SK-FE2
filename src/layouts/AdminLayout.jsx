import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- 1. SIDEBAR (Bên trái) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">

        {/* Logo Admin */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">CLB Manager</h1>
        </div>

        {/* Menu điều hướng */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link to="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-slate-800 transition">
            📊 Tổng quan (Dashboard)
          </Link>

          <Link to="/admin/clubs" className="block px-4 py-2 rounded hover:bg-slate-800 transition">
            🏢 Quản lý CLB
          </Link>

          <Link to="/admin/events" className="block px-4 py-2 rounded hover:bg-slate-800 transition">
            📅 Quản lý Sự kiện
          </Link>
          
          <div className="border-t border-slate-700 my-2"></div>
           <Link to="/" className="block px-4 py-2 rounded hover:bg-slate-800 text-gray-400 text-sm transition">
            ⬅️ Về trang sinh viên
          </Link>
        </nav>

        {/* Footer của Sidebar */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                {user?.hoTen?.charAt(0) || "A"}
             </div>
             <div>
                <p className="text-sm font-medium">{user?.hoTen || "Admin"}</p>
                <p className="text-xs text-gray-400">Quản trị viên</p>
             </div>
          </div>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT (Bên phải) --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Admin */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-700">Trang Quản Trị</h2>
          
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Đăng xuất
          </button>
        </header>

        {/* Nơi hiển thị nội dung thay đổi (Dashboard, CLB, Event...) */}
        <main className="flex-1 overflow-y-auto p-6">
           {/* ĐÂY LÀ VỊ TRÍ "CỬA SỔ THẦN KỲ" */}
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;