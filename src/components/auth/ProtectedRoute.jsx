import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Đang tải xác thực...</div>;

    // 1. Chưa đăng nhập
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Kiểm tra quyền (Logic tùy chỉnh cho dự án này)
    // allowedRoles là mảng các quyền cho phép: ['ADMIN', 'MANAGER', 'STUDENT']
    if (allowedRoles) {
        // Logic kiểm tra:
        // - Nếu yêu cầu ADMIN: user.vaiTro phải là ADMIN
        // - Nếu yêu cầu MANAGER: user.isManager = true HOẶC user.vaiTro = ADMIN
        // - Nếu yêu cầu STUDENT: Luôn đúng (vì đã login)
        
        const hasPermission = allowedRoles.some(role => {
            if (role === 'ADMIN') return user.vaiTro === 'ADMIN';
            if (role === 'MANAGER') return user.isManager === true || user.vaiTro === 'ADMIN';
            return true; // Mặc định cho các role khác
        });

        if (!hasPermission) {
            return <Navigate to="/" replace />; // Không đủ quyền -> Về trang chủ
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;