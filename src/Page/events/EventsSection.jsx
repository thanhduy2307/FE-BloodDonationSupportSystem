import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../configs/axios';

const EventsSection = () => {
  const [events, setEvents] = useState([]);
const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('events');
        const data = response.data;
        const formatted = data.map(event => ({
          id: event.eventId,
          title: event.title,
          description: event.description,
          date: event.eventDate || "Chưa xác định",
          time: "08:00 - 16:00", 
          location: event.description || "Địa điểm chưa rõ", 
          image: "https://via.placeholder.com/400x200.png?text=Blood+Event" 
        }));
        setEvents(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sự kiện:", err);
      }
    };

    fetchEvents();
  }, []);

  const slidesToShow = 3; 
const EventCard = ({ title, date, time, location, image }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transform transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative h-48">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        Sắp diễn ra
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2 text-red-600" />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2 text-red-600" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2 text-red-600" />
          <span>{location}</span>
        </div>
      </div>
      <a href="#register" className="text-red-600 font-medium flex items-center hover:text-red-700 transition">
        Đăng ký tham gia
        <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  </div>
);

return (
  <section id="events" className="py-16 bg-red-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sự Kiện Hiến Máu Sắp Tới</h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Tham gia các sự kiện hiến máu gần đây để cùng chung tay cứu giúp những người bệnh cần truyền máu và lan tỏa tinh thần nhân đạo trong cộng đồng.
        </p>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${activeSlide * (100 / slidesToShow)}%)`,
            width: `${(events.length / slidesToShow) * 100}%`
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="px-3"
              style={{
                flexBasis: `${100 / slidesToShow}%`
              }}
            >
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
};

export default EventsSection;
