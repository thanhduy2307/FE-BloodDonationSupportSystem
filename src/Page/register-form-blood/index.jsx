import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const BloodDonationForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Họ và tên
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập họ tên"
            />
          </div>

          {/* Tuổi */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tuổi</label>
            <input
              type="number"
              min={16}
              max={65}
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập tuổi"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Giới tính
            </label>
            <select className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none">
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          {/* Giới tính */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Ngày tháng năm sinh
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Nhóm máu */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Nhóm máu
            </label>
            <select className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none">
              <option>A</option>
              <option>B</option>
              <option>AB</option>
              <option>O</option>
              <option>Chưa biết</option>
            </select>
          </div>

          {/* Địa chỉ */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Địa chỉ
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Số điện thoại */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Số điện thoại
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập số điện thoại"
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
