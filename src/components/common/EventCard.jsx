import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Xử lý hiển thị ngày tháng cho đẹp
  const formattedDate = new Date(event.thoiGianBatDau).toLocaleDateString('vi-VN', {
    day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Ảnh bìa sự kiện (nếu không có thì dùng ảnh mặc định) */}
      <img 
        src={event.anhSuKienUrl || "https://via.placeholder.com/400x200?text=No+Image"} 
        alt={event.tenSuKien} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-sm text-blue-600 font-semibold mb-1">
          {event.Club?.tenCLB || "CLB Sự kiện"} {/* Hiển thị tên CLB tổ chức */}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {event.tenSuKien}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {event.moTa}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
            <span>📅 {formattedDate}</span>
            <span>📍 {event.diaDiem}</span>
          </div>
          
          {/* Nút xem chi tiết */}
          <Link 
            to={`/events/${event.eventId}`} 
            className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;