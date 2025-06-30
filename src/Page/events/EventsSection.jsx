import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../configs/axios";

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesToShow = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("Event/getAll");
        const data = response.data;

        const formatted = data.map((event) => ({
          id: event.eventId,
          title: event.title,
          description: event.description || "",
          date: event.eventDate || "Chưa xác định",
          time: "08:00 - 16:00",
          location: event.description || "Địa điểm chưa rõ",
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sự kiện:", err);
      }
    };

    fetchEvents();
  }, []);

  const EventCard = ({ title, date, time, location }) => (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col justify-between hover:shadow-lg transition transform hover:-translate-y-1 border">
      <div className="mb-4">
        <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
          Sắp diễn ra
        </span>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <div className="space-y-1 text-gray-600 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-red-600" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-red-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-600" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      <a
        href="#register"
        className="text-red-600 text-sm font-medium flex items-center hover:text-red-700 transition"
      >
        Đăng ký tham gia
        <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );

  return (
    <section id="events" className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sự Kiện Hiến Máu Sắp Tới
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Tham gia các sự kiện hiến máu gần đây để cùng chung tay cứu giúp
            những người bệnh cần truyền máu và lan tỏa tinh thần nhân đạo trong
            cộng đồng.
          </p>
        </div>

        <div className="relative">
          {/* Điều hướng trái phải */}
          <button
            onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
            disabled={activeSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6 text-red-600" />
          </button>

          <button
            onClick={() =>
              setActiveSlide((prev) =>
                Math.min(prev + 1, Math.ceil(events.length / slidesToShow) - 1)
              )
            }
            disabled={activeSlide >= Math.ceil(events.length / slidesToShow) - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6 text-red-600" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${activeSlide * (100 / slidesToShow)}%)`,
                width: `${(events.length / slidesToShow) * 100}%`,
              }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  className="px-3"
                  style={{
                    flexBasis: `${100 / slidesToShow}%`,
                  }}
                >
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
