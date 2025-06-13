import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Crop as Drop } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);
}, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Drop className="text-red-600 mr-2" size={28} strokeWidth={2.5} />
          <span className="text-2xl font-bold text-red-600">HeartDrop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-800 hover:text-red-600 font-medium transition">
            Trang chủ
          </Link>
          <a href="#about" className="text-gray-800 hover:text-red-600 font-medium transition">
            Về chúng tôi
          </a>
          <a href="#events" className="text-gray-800 hover:text-red-600 font-medium transition">
            Sự kiện
          </a>
          <a href="#blog" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
            Blog
          </a>
          <a href="#testimonials" className="text-gray-800 hover:text-red-600 font-medium transition">
            Câu chuyện
          </a>
          <a href="#faq" className="text-gray-800 hover:text-red-600 font-medium transition">
            Hỏi đáp
          </a>

          {!user && ( // 👈 Kiểm tra nếu chưa đăng nhập mới hiển thị
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium transition">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-white bg-red-600 hover:bg-red-700 py-2 px-6 rounded-full font-medium transition transform hover:scale-105"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link to="/" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
              Trang chủ
            </Link>
            <a href="#about" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
              Về chúng tôi
            </a>
            <a href="#events" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
              Sự kiện
            </a>
            <a href="#testimonials" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
              Câu chuyện
            </a>
            <a href="#faq" className="text-gray-800 hover:text-red-600 font-medium transition py-2">
              Hỏi đáp
            </a>

            {!user && ( // 👈 Mobile cũng kiểm tra nếu chưa login
              <>
                <Link to="/login" className="text-red-600 hover:text-red-700 font-medium transition py-2">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-red-600 hover:bg-red-700 py-2 px-6 rounded-full font-medium transition text-center"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
