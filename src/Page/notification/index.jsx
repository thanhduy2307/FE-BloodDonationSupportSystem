import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Info } from "lucide-react";
import api from "path-to-your-api"; // Adjust the import based on your project structure

const mockNotifications = [
  {
    id: 1,
    title: "Đăng ký hiến máu thành công",
    content: "Bạn đã được chấp nhận tham gia sự kiện hiến máu vào ngày 30/06/2025.",
    time: "2 phút trước",
    type: "success",
  },
  {
    id: 2,
    title: "Cập nhật sự kiện",
    content: "Sự kiện hiến máu ở BV Chợ Rẫy đã dời sang ngày 05/07/2025.",
    time: "1 giờ trước",
    type: "info",
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const handleGetNotifications = () => {
    // Simulate fetch notifications
    setNotifications(mockNotifications);
    setHasNew(false);
  };

  // Lấy tất cả thông báo
  const getAllNotifications = async () => {
    const res = await api.get("Notification/getAll");
    return res.data; // [{id, title, content, time, type}, ...]
  };

  // Tạo mới một thông báo
  const createNotification = async (notification) => {
    // notification: { title, content, type }
    const res = await api.post("Notification/create", notification);
    return res.data; // trả về thông báo vừa tạo hoặc status
  };

  // Lấy danh sách thông báo
  useEffect(() => {
    getAllNotifications().then(setNotifications);
  }, []);

  // Tạo thông báo mới
  const handleCreate = async () => {
    await createNotification({
      title: "Tiêu đề mới",
      content: "Nội dung thông báo",
      type: "info", // hoặc "success"
    });
    // Sau khi tạo xong, reload lại danh sách
    getAllNotifications().then(setNotifications);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Thông báo của bạn</h1>
        <button
          onClick={handleGetNotifications}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          <Bell className="w-5 h-5" />
          Nhận thông báo
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 italic">Hiện chưa có thông báo nào.</p>
        ) : (
          notifications.map((noti) => (
            <div
              key={noti.id}
              className={`p-4 rounded-xl shadow-sm border ${
                noti.type === "success"
                  ? "bg-green-50 border-green-300"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {noti.type === "success" ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <Info className="text-blue-600" />
                )}
                <div>
                  <h3 className="font-semibold">{noti.title}</h3>
                  <p className="text-sm text-gray-700">{noti.content}</p>
                  <span className="text-xs text-gray-400">{noti.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div    </div>
  );
}
