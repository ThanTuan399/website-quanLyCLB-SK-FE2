const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tổng quan hệ thống</h1>
      
      {/* Các thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Tổng số CLB</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Sự kiện sắp tới</h3>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Sinh viên tích cực</h3>
          <p className="text-2xl font-bold">1,250</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
