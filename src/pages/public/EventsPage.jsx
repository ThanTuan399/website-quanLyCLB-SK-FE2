import { useState, useEffect } from 'react';
import eventService from '../../services/event.service';
import EventCard from '../../components/common/EventCard';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("Lỗi tải sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải danh sách...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Tất cả Sự kiện & Hoạt động
      </h1>

      {/* Thanh tìm kiếm (Placeholder - Để đó phát triển sau) */}
      <div className="mb-8 flex justify-center">
        <input 
          type="text" 
          placeholder="Tìm kiếm sự kiện..." 
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Hiện chưa có sự kiện nào.</p>
      )}
    </div>
  );
};

export default EventsPage;