import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const BloodDonationForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: 250,
    donationDate: dayjs().format("YYYY-MM-DD"),
    donationTime: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra giờ hiến máu chỉ từ 07:00 đến 16:30
    const time = formData.donationTime;
    if (!time) {
      return message.error("Vui lòng chọn giờ hiến máu!");
    }

    const [hour, minute] = time.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    const minMinutes = 7 * 60;
    const maxMinutes = 16 * 60 + 30;

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return message.error("Giờ hiến máu chỉ được phép từ 07:00 đến 16:30!");
    }

    try {
      const data = {
        bloodType: formData.bloodType,
        quantity: Number(formData.quantity),
        donationDate: formData.donationDate,
        donationTime: time.length === 5 ? `${time}:00` : time,
      };

      await api.post("/User/donate", data);

      message.success("Đăng ký hiến máu thành công!");
      toast.success("Đăng ký thành công");

      setFormData({
        bloodType: "",
        quantity: 250,
        donationDate: dayjs().format("YYYY-MM-DD"),
        donationTime: "",
      });
    } catch (err) {
      console.error("❌ Lỗi gửi đăng ký:", err);
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
          Phiếu đăng ký hiến máu
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

          {/* Lượng máu */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Lượng máu (ml)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={250}
              max={500}
              required
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập số ml"
            />
          </div>

          {/* Ngày hiến */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Ngày hiến máu
            </label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              required
              min={dayjs().format("YYYY-MM-DD")}
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Giờ hiến */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Giờ hiến máu
            </label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime}
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

export default BloodDonationForm;
