import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const NotificationUser = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/Notification/getByUser");
      const sorted = res.data.sort(
        (a, b) => new Date(b.notifDate) - new Date(a.notifDate)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await api.post(`/Notification/mark-as-read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Danh sách thông báo</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">Không có thông báo nào.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.notificationId}
              onClick={() => handleRead(n.notificationId)}
              className={`cursor-pointer p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition ${
                n.isRead ? "bg-white" : "bg-red-50"
              }`}
            >
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-500">
                {dayjs(n.notifDate).format("DD/MM/YYYY HH:mm")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationUser;
