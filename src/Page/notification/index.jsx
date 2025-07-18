import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Gọi khi component mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/Notification/getByUser");
      setNotifications(res.data);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/Notification/unread-count");
      setUnreadCount(res.data); // BE trả về số
    } catch (err) {
      console.error("Lỗi lấy số lượng chưa đọc:", err);
    }
  };

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        await api.post("/Notification/mark-all-as-read");
        fetchNotifications();
        fetchUnreadCount();
      } catch (err) {
        console.error("Lỗi đánh dấu đã đọc:", err);
      }
    }
  };

  const handleClickNotification = async (notificationId) => {
    try {
      await api.post(`/Notification/mark-as-read/${notificationId}`);
      fetchNotifications();
      fetchUnreadCount();
      navigate(`/notification/${notificationId}`);
    } catch (err) {
      console.error("Lỗi đánh dấu thông báo:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b font-semibold text-red-600">Thông báo</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm text-center">
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 border-b last:border-none ${
                    !n.isRead ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleClickNotification(n.notificationId)}
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(n.notifDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
