const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Hệ thống Quản lý CLB Sinh viên.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Xây dựng bởi Nhóm Thực tập CNTT.
        </p>
      </div>
    </footer>
  );
};

export default Footer;