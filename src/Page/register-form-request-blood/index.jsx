import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const BloodRequestForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: 0,
    requestDate: dayjs().format("YYYY-MM-DD"),
    requestTime: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "requestTime" && value.length === 5 ? `${value}:00` : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra giờ nhận máu hợp lệ (07:00 - 16:30)
    const time = formData.requestTime;
    if (!time) {
      return message.error("Vui lòng chọn giờ cần nhận máu!");
    }

    const [hour, minute] = time.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    const minMinutes = 7 * 60; // 07:00
    const maxMinutes = 16 * 60 + 30; // 16:30

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return message.error("Giờ nhận máu chỉ được phép từ 07:00 đến 16:30!");
    }

    try {
      const data = {
        ...formData,
        userId: user?.id || user?.userId || null,
        status: "Pending",
      };
      await api.post("/User/request", data);
      message.success("Đăng ký nhận máu thành công!");
      toast.success("Đăng ký thành công!");
      setFormData({
        bloodType: "",
        quantity: 0,
        requestDate: dayjs().format("YYYY-MM-DD"),
        requestTime: "",
      });
    } catch (err) {
      console.error("❌ Lỗi gửi đăng ký:", err?.response?.data || err);
      message.error("Gửi đăng ký thất bại!");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4 pt-24">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 bg-white text-red-600 font-semibold px-4 py-2 rounded shadow hover:bg-red-100 transition"
        >
          ← Về trang chủ
        </button>
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Phiếu đăng ký nhận máu
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nhóm máu */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Nhóm máu
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">-- Chọn nhóm máu --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
              <option value="Unknown">Chưa biết</option>
            </select>
          </div>

          {/* Số lượng */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Lượng máu cần (ml)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={250}
              max={2000}
              required
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập số ml"
            />
          </div>

          {/* Ngày cần */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Ngày cần
            </label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleChange}
              required
              min={dayjs().format("YYYY-MM-DD")}
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Giờ cần */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Giờ cần
            </label>
            <input
              type="time"
              name="requestTime"
              value={formData.requestTime.slice(0, 5)} // Hiển thị HH:mm
              onChange={handleChange}
              required
              min="07:00"
              max="16:30"
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Nút gửi */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105"
            >
              Gửi đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BloodRequestForm;
