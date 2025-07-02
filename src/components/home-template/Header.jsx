import React, { useState, useEffect } from "react";
import { Menu, X, Heart, Crop as Drop } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import api from "../../configs/axios";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasNewNoti, setHasNewNoti] = useState(false);
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
  useEffect(() => {
    const checkNewNotifications = async () => {
      try {
        const res = await api.get("/Notification/getByUser");
        const now = dayjs();
        const recent = res.data.some((n) => {
          const date = dayjs(n.notifDate);
          return now.diff(date, "hour") < 24; // Ví dụ: có thông báo trong 24h
        });
        setHasNewNoti(recent);
      } catch {
        console.error("Không thể kiểm tra thông báo");
      }
    };

    checkNewNotifications();
  }, []);
  const handleNavigateScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100); // chờ để đảm bảo DOM đã load xong
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
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
          <button
            onClick={() => handleNavigateScroll("about")}
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Về chúng tôi
          </button>
          <Link
            to="/events"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Sự kiện
          </Link>
          <Link
            to="/blogs"
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Blog
          </Link>
          <button
            onClick={() => handleNavigateScroll("testimonials")}
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Câu chuyện
          </button>
          <button
            onClick={() => handleNavigateScroll("faq")}
            className="text-gray-800 hover:text-red-600 font-medium transition"
          >
            Hỏi đáp
          </button>

          {user ? (
            <div className="relative flex items-center space-x-4">
              {/* Nút chuông thông báo */}
              <button
                onClick={() => navigate("/notificationn")}
                className="text-gray-700 hover:text-red-500 transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                {/* Badge thông báo (bật khi cần) */}
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
        {notifications.length}
      </span> */}
              </button>

              {/* Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
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

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-10 z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Trang cá nhân
                    </button>
                    <button
                      onClick={() => {
                        navigate("/feedback");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-red-100 transition-colors"
                    >
                      Phản hồi
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleNavigateScroll("about");
              }}
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Về chúng tôi
            </button>
            <Link
              to="/events"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sự kiện
            </Link>
            <Link
              to="/blogs"
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleNavigateScroll("testimonials");
              }}
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Câu chuyện
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleNavigateScroll("faq");
              }}
              className="text-gray-800 hover:text-red-600 font-medium transition py-2"
            >
              Hỏi đáp
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
