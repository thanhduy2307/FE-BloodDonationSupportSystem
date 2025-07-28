import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const NotificationUser = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/Notification/unread-count");
      setUnreadCount(res.data.realCount); // ✅ Sửa ở đây
    } catch (err) {
      console.error("Lỗi khi lấy số tin nhắn chưa đọc:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/Notification/getByUser");
      // Sắp xếp theo thời gian mới nhất và ưu tiên tin chưa đọc
      const sorted = res.data.sort((a, b) => {
        // Nếu một tin chưa đọc và một tin đã đọc, ưu tiên tin chưa đọc
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        // Nếu cùng trạng thái đọc, sắp xếp theo thời gian mới nhất
        return new Date(b.notifDate) - new Date(a.notifDate);
      });
      setNotifications(sorted);
      fetchUnreadCount();
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRead = async (id) => {
    try {
      await api.put(`/Notification/mark-as-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const formatTimeAgo = (date) => {
    const now = dayjs();
    const notifDate = dayjs(date);
    const diffMinutes = now.diff(notifDate, "minute");
    const diffHours = now.diff(notifDate, "hour");
    const diffDays = now.diff(notifDate, "day");

    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return notifDate.format("DD/MM/YYYY HH:mm");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-red-500 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">Thông báo</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition"
            >
              Trang chủ
            </button>
          </div>

          {/* Counter */}
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{unreadCount}</p>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  onClick={() => handleRead(notification.notificationId)}
                  className={`px-6 py-4 cursor-pointer transition ${
                    notification.isRead
                      ? "bg-white hover:bg-gray-50"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          notification.isRead
                            ? "text-gray-600"
                            : "text-gray-900 font-medium"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatTimeAgo(notification.notifDate)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationUser;
