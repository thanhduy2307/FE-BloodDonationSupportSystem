import React from 'react';
import { Crop as Drop, Heart, Phone, Mail, MapPin, FacebookIcon, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <Drop className="text-red-500 mr-2" size={28} />
              <span className="text-2xl font-bold">HeartDrop</span>
            </div>
            <p className="text-gray-400 mb-6">
              Hiến máu nhân đạo - Kết nối yêu thương, lan tỏa sự sống và niềm hy vọng đến mọi người.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-white transition">Trang chủ</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition">Về chúng tôi</a></li>
              <li><a href="#events" className="text-gray-400 hover:text-white transition">Sự kiện</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition">Câu chuyện</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition">Hỏi đáp</a></li>
              <li><a href="#register" className="text-gray-400 hover:text-white transition">Đăng ký hiến máu</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">0123 456 789</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">info@heartdrop.vn</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Viện Huyết học - Truyền máu Trung ương, Phạm Văn Bạch, Cầu Giấy, Hà Nội
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Đăng ký nhận tin</h3>
            <p className="text-gray-400 mb-4">
              Đăng ký để nhận thông tin về các sự kiện hiến máu sắp tới và những tin tức mới nhất.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-gray-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button className="bg-red-600 hover:bg-red-700 text-white rounded-r-lg px-4 transition">
                  Gửi
                </button>
              </div>
            </form>
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-gray-400">Cảm ơn bạn đã quan tâm!</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © 2025 HeartDrop - Hiến máu nhân đạo. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Chính sách bảo mật</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Trợ giúp</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
