import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-red-50 to-white relative overflow-hidden"
    >
      {/* Background blur balls */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-red-100 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="relative mb-6">
              <Heart className="text-red-200 absolute -top-8 -left-6" size={48} />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight md:leading-snug">
                Mỗi giọt máu hiến tặng
                <br />
                <span className="text-red-600">Một cuộc đời được cứu</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl leading-relaxed">
              Hiến máu nhân đạo là nghĩa cử cao đẹp, góp phần cứu giúp những người bệnh cần truyền máu, mang lại sự sống và niềm hy vọng cho cộng đồng.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/registerForm"
                className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center"
              >
                Đăng ký hiến máu
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-lg font-semibold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center justify-center"
              >
                Tìm hiểu thêm
              </Link>
              <Link
                to="/requestForm"
                className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-lg font-semibold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center justify-center"
              >
                Đăng kí nhận máu 
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative max-w-md">
              <div className="absolute inset-0 bg-red-600 rounded-full opacity-10 animate-pulse transform scale-105"></div>
              <img
                src="https://images.pexels.com/photos/6823517/pexels-photo-6823517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Blood donation"
                className="rounded-xl shadow-2xl relative z-10 max-w-full h-auto"
                style={{ maxHeight: '500px' }}
                loading="lazy"
                decoding="async"
              />
              {/* Stats badge */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center">
                  <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-3">
                    <Heart size={24} fill="white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold">Đã cứu</p>
                    <p className="text-2xl font-bold text-red-600">1,240,876</p>
                    <p className="text-sm text-gray-600">người bệnh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
