import React, { useState, useEffect } from "react";
import { Menu, X, Heart, Crop as Drop } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Drop className="text-red-600 mr-2" size={28} strokeWidth={2.5} />
          <span className="text-2xl font-bold text-red-600">HeartDrop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Trang chủ
          </Link>
          <a
            href="#about"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Về chúng tôi
          </a>
          <a
            href="#events"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Sự kiện
          </a>
          <a
            href="#blog"
            className="text-gray-800 hover:text-red-600 font-medium transition py-2"
          >
            Blog
          </a>
          <a
            href="#testimonials"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Câu chuyện
          </a>
          <a
            href="#faq"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Hỏi đáp
          </a>

         {user ? (
  <div className="relative">
    <button
      onClick={toggleDropdown}
      className="flex items-center space-x-2 focus:outline-none"
    >
      <img
        src={
          user?.avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsVNNgXA9Qlq5GaQtWcqv0eyrFFLBJXWXpnw&s"
        }
        alt={user?.fullName}
        className="h-10 w-10 rounded-full object-cover border-2 border-red-500 hover:scale-105 transition-transform"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/40";
        }}
      />
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-10 z-50 overflow-hidden">
        <a
          href="#profile"
          className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Trang cá nhân
        </a>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-100 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center space-x-4">
    <button
      onClick={() => navigate("/login")}
      className="text-red-600 hover:text-red-700 font-medium transition"
    >
      Đăng nhập
    </button>
    <button
      onClick={() => navigate("/register")}
      className="text-white bg-red-600 hover:bg-red-700 py-2 px-6 rounded-full font-medium transition transform hover:scale-105"
    >
      Đăng ký
    </button>
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
            <Link
              to="/"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Trang chủ
            </Link>
            <a
              href="#about"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Về chúng tôi
            </a>
            <a
              href="#events"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Sự kiện
            </a>
            <a
              href="#testimonials"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Câu chuyện
            </a>
            <a
              href="#faq"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Hỏi đáp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
