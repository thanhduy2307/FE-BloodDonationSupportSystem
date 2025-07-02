import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";

const NotificationUser = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/Notification/getAll"); 
      setNotifications(res.data);
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
      {/* Nút quay về - sát trái */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ← Quay về trang chủ
        </button>
      </div>

      {/* Nội dung chính căn giữa */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Thông báo của bạn</h2>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">Không có thông báo nào.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.notificationId}
                className="border-b pb-3 last:border-b-0 last:pb-0"
              >
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500">
                  Gửi ngày: {dayjs(n.notifDate).format("DD/MM/YYYY")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationUser;