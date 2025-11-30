import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import registrationService from '../../services/registration.service';
import eventService from '../../services/event.service';

const EventReportPage = () => {
  const { id } = useParams(); // Lấy ID sự kiện từ URL
  const [stats, setStats] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song 2 API để tiết kiệm thời gian
        const [reportData, eventData] = await Promise.all([
          registrationService.getReport(id),
          eventService.getEventById(id)
        ]);

        setStats(reportData.stats);
        setEventInfo(eventData);
      } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Đang tính toán số liệu...</div>;
  if (!stats || !eventInfo) return <div className="p-8 text-center text-red-500">Không tìm thấy dữ liệu.</div>;

  // Tính toán số liệu cho Biểu đồ
  const daDangKy = stats.registered;
  const conTrong = Math.max(0, eventInfo.soLuongToiDa - daDangKy);
  
  const chartData = [
    { name: 'Đã đăng ký', value: daDangKy },
    { name: 'Còn trống', value: conTrong },
  ];

  const COLORS = ['#0088FE', '#E5E7EB']; // Xanh dương (Đăng ký) - Xám (Trống)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Báo cáo Sự kiện</h1>
      <h2 className="text-xl text-blue-600 font-semibold mb-8">{eventInfo.tenSuKien}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CỘT 1: Các thẻ số liệu */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm uppercase font-bold">Tổng đăng ký</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-800">{daDangKy}</span>
              <span className="text-gray-400 mb-1">/ {eventInfo.soLuongToiDa} chỗ</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Sinh viên đã bấm nút đăng ký trên hệ thống.
            </p>
          </div>

          <div className={`bg-white p-6 rounded-lg shadow border-l-4 ${conTrong === 0 ? 'border-red-500' : 'border-green-500'}`}>
            <h3 className="text-gray-500 text-sm uppercase font-bold">Trạng thái</h3>
            <p className={`text-2xl font-bold ${conTrong === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {conTrong === 0 ? "ĐÃ HẾT CHỖ (Sold Out)" : "ĐANG MỞ ĐĂNG KÝ"}
            </p>
          </div>
        </div>

        {/* CỘT 2: Biểu đồ tròn */}
        <div className="bg-white p-6 rounded-lg shadow h-80 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-sm uppercase font-bold mb-4">Tỷ lệ lấp đầy</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default EventReportPage;