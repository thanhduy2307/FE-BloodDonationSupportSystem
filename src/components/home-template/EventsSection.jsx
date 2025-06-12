import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Hiến Máu Tình Nguyện tại Đại học Y Hà Nội",
    date: "15/06/2025",
    time: "08:00 - 16:00",
    location: "Đại học Y Hà Nội, Đống Đa, Hà Nội",
    image: "https://images.pexels.com/photos/6097919/pexels-photo-6097919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    title: "Ngày hội Hiến máu Chủ nhật Đỏ 2025",
    date: "20/06/2025",
    time: "07:30 - 17:00",
    location: "Nhà Văn hóa Thanh niên, Quận 1, TP. HCM",
    image: "https://images.pexels.com/photos/6823449/pexels-photo-6823449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    title: "Hiến máu nhân đạo - Ngày hội màu đỏ",
    date: "28/06/2025",
    time: "08:00 - 16:30",
    location: "Viện Huyết học Truyền máu TW, Hà Nội",
    image: "https://tmp.vn/storage/app/media/uploaded-files/Hien%20mau%20TM%202022.png"
  },
  {
    id: 4,
    title: "Lễ hội Hiến máu tình nguyện Đà Nẵng",
    date: "05/07/2025",
    time: "07:00 - 16:00",
    location: "Bệnh viện Đà Nẵng, Hải Châu, Đà Nẵng",
    image: "https://images.pexels.com/photos/5726834/pexels-photo-5726834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const EventsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const [slidesToShow, setSlidesToShow] = useState(slidesPerView.desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(slidesPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(slidesPerView.tablet);
      } else {
        setSlidesToShow(slidesPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) =>
      prev === events.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? events.length - slidesToShow : prev - 1
    );
  };

  const EventCard = ({ title, date, time, location, image }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transform transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
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
            Tham gia các sự kiện hiến máu gần đây để cùng chung tay cứu giúp những người bệnh
            cần truyền máu và lan tỏa tinh thần nhân đạo trong cộng đồng.
          </p>
        </div>

        <div className="relative">
          <div className="flex justify-end mb-6 space-x-2">
            <button 
              onClick={prevSlide}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button 
              onClick={nextSlide}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
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
                    flexBasis: `${100 / events.length * slidesToShow}%`
                  }}
                >
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a 
            href="#all-events" 
            className="inline-flex items-center justify-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full px-6 py-2 font-medium transition"
          >
            Xem tất cả sự kiện
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
