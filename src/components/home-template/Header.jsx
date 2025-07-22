// ... các import giữ nguyên
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Heart, Crop as Drop, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import dayjs from "dayjs";
import api from "../../configs/axios";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [hasNewNoti, setHasNewNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const notiRef = useRef(null);

  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Theo dõi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy thông báo ban đầu + polling mỗi 5s
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/Notification/getByUser");
        setNotifications(res.data || []);
        const hasUnread = res.data.some((n) => !n.isRead);
        setHasNewNoti(hasUnread);
      } catch {
        console.error("Không thể kiểm tra thông báo");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // polling mỗi 5s
    return () => clearInterval(interval);
  }, []);

  // Khi mở dropdown thì đánh dấu đã đọc
  useEffect(() => {
    if (showNotiDropdown) {
      const markAsRead = async () => {
        try {
          await api.put("/Notification/mark-all-as-read");
          setHasNewNoti(false);
        } catch (err) {
          console.error("Lỗi đánh dấu thông báo đã đọc");
        }
      };
      markAsRead();
    }
  }, [showNotiDropdown]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      console.log("Gọi unread count...");
      const res = await api.get("/Notification/unread-count");
      console.log("Kết quả unread count:", res.data);
      setUnreadCount(res.data.realCount); // hoặc res.data tùy response
    } catch (err) {
      console.error("Lỗi khi gọi unread count:", err);
    }
  };
  // Đóng dropdown nếu click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  const handleNavigateScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

        <nav className="hidden md:flex items-center space-x-8">
          {/* menu giữ nguyên */}
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
              {/* Chuông thông báo */}
              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => setShowNotiDropdown((prev) => !prev)}
                  className="relative text-gray-700 hover:text-red-500 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[11px] min-w-[1.25rem] h-5 rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                </button>

                {showNotiDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b font-semibold text-red-600">
                      Thông báo
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-sm text-center">
                          Không có thông báo nào.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.notificationId}
                            onClick={() => {
                              if (n.url) navigate(n.url);
                              setShowNotiDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-none"
                          >
                            <p className="text-sm text-gray-800">{n.message}</p>
                            <p className="text-xs text-gray-500">
                              {dayjs(n.notifDate).format("DD/MM/YYYY")}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar dropdown giữ nguyên */}
              <div className="relative" ref={dropdownRef}>
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

        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
