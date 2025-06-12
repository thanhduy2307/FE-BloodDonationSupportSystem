import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Hiến máu 15 lần",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "Hiến máu đã trở thành thói quen của tôi mỗi 3 tháng. Tôi luôn tự hào khi biết rằng hành động nhỏ của mình có thể cứu sống nhiều người.",
    donationCount: 15
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Hiến máu 8 lần",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "Lần đầu tiên tôi hiến máu là khi người thân cần truyền máu. Từ đó, tôi nhận ra ý nghĩa to lớn của việc hiến máu và trở thành người hiến máu thường xuyên.",
    donationCount: 8
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Hiến máu 20 lần",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "Mỗi lần hiến máu, tôi đều cảm thấy mình đang làm một việc ý nghĩa. Đặc biệt khi biết được máu của mình đã cứu sống một em bé sơ sinh, tôi càng thấy việc hiến máu quan trọng.",
    donationCount: 20
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Tự động chuyển slide mỗi 5s (bạn có thể bỏ nếu không muốn)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Câu Chuyện Từ Người Hiến Máu</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Những câu chuyện cảm động từ người hiến máu và người nhận máu,
            lan tỏa tinh thần tương thân tương ái trong cộng đồng.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div 
              role="region"
              aria-live="polite"
              aria-atomic="true"
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                          <div className="relative">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-32 h-32 object-cover rounded-full border-4 border-red-100"
                            />
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                              {testimonial.donationCount}
                            </div>
                          </div>
                        </div>
                        <div className="md:w-2/3 md:pl-8">
                          <div className="mb-4">
                            <Quote className="text-red-200 w-12 h-12" />
                          </div>
                          <p className="text-gray-700 text-lg italic mb-6">
                            "{testimonial.quote}"
                          </p>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                            <p className="text-red-600">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-3 transition focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  className={`w-3 h-3 rounded-full transition ${
                    activeIndex === index ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                />
              ))}

              <button 
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-3 transition focus:outline-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-xl p-6 md:p-8">
              <div className="flex items-center mb-4">
                <Star fill="currentColor" className="text-yellow-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Câu chuyện từ người nhận máu</h3>
              </div>
              <p className="text-gray-700 mb-4">
                "Sau tai nạn giao thông, tôi đã mất rất nhiều máu và cần truyền gấp. 
                Nhờ có người hiến máu tình nguyện, tôi đã được cứu sống. Tôi biết ơn những 
                người hiến máu đã cho tôi cơ hội sống tiếp."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Blood recipient" 
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Phạm Văn D</p>
                  <p className="text-sm text-gray-600">Nạn nhân tai nạn giao thông</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 md:p-8">
              <div className="flex items-center mb-4">
                <Star fill="currentColor" className="text-yellow-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Trải nghiệm của bác sĩ</h3>
              </div>
              <p className="text-gray-700 mb-4">
                "Là bác sĩ huyết học, tôi thấy rõ nhu cầu về máu rất lớn. Mỗi đơn vị máu 
                hiến tặng đều vô cùng quý giá. Đôi khi chúng tôi phải hoãn ca phẫu thuật vì 
                thiếu máu. Tôi rất biết ơn những người hiến máu tình nguyện."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Doctor" 
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Bs. Trần Thị E</p>
                  <p className="text-sm text-gray-600">Bác sĩ Huyết học</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
