import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const BloodRequestForm = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null); 
  const [formData, setFormData] = useState({
    quantity: 250,
    requestDate: dayjs().format("YYYY-MM-DD"),
    requestTime: "",
  });

  // Gọi API lấy thông tin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/User/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy profile:", err);
        message.error("Không thể tải thông tin người dùng");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

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

    if ( !profile?.bloodGroup) {
      message.error("Thiếu thông tin người dùng hoặc nhóm máu.");
      return;
    }

    const data = {
      ...formData,
      userId: profile.id,
      bloodType: profile.bloodGroup,
      status: "Pending",
    };

    try {
      await api.post("/User/request", data);
      toast.success("Đăng ký nhận máu thành công!");
      setFormData({
        quantity: 250,
        requestDate: dayjs().format("YYYY-MM-DD"),
        requestTime: "",
      });
    } catch (err) {
      console.error("❌ Lỗi gửi đăng ký:", err?.response?.data || err);
      message.error("Gửi đăng ký thất bại!");
    }
  };

  if (!profile) return null; // hoặc hiển thị loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4 pt-24">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 bg-white text-red-600 font-semibold px-4 py-2 rounded shadow hover:bg-red-100 transition z-50"
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
          {/* Số lượng mặc định */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Lượng máu cần (ml)
            </label>
            <input
              type="number"
              value={formData.quantity}
              disabled
              className="w-full px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 rounded-md"
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
              value={formData.requestTime.slice(0, 5)}
              onChange={handleChange}
              required
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
