import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const BloodRequestForm = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const [formData, setFormData] = useState({
    quantity: 250,
    requestDate: dayjs().format("YYYY-MM-DD"),
    requestTime: "",
  });

  // Gọi API lấy thông tin profile và kiểm tra đơn đang chờ
  useEffect(() => {
    const fetchProfileAndRequests = async () => {
      try {
        const res = await api.get("/User/profile");
        if (!res.data.bloodGroup) {
          toast.error("Vui lòng cập nhật nhóm máu trước khi đăng ký nhận máu.");
          navigate("/profile");
          return;
        }
        setProfile(res.data);

        // Gọi API lấy các đơn nhận máu
        const requestRes = await api.get("/User/request");
        const hasPending = requestRes.data.some(
          (req) => req.status === "Pending"
        );
        if (hasPending) {
          setHasPendingRequest(true);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải thông tin người dùng");
        navigate("/login");
      }
    };

    fetchProfileAndRequests();
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

    if (hasPendingRequest) {
      toast.warn("Bạn đã có một yêu cầu nhận máu đang chờ duyệt.");
      return;
    }

    const [hour, minute] = formData.requestTime.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    const minMinutes = 7 * 60;
    const maxMinutes = 16 * 60 + 30;

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      toast.error("⏰ Giờ nhận máu chỉ được phép từ 07:00 đến 16:30!");
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
      setHasPendingRequest(true);
    } catch (err) {
      console.error("❌ Lỗi gửi đăng ký:", err?.response?.data || err);
      message.error("Gửi đăng ký thất bại!");
    }
  };

  if (!profile) return null;

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

        {hasPendingRequest ? (
          <div className="text-center text-red-500 font-semibold text-lg py-8">
            ⚠️ Bạn đã có một yêu cầu nhận máu đang chờ duyệt. Không thể đăng ký thêm!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
                min="07:00"
                max="16:30"
                className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105"
              >
                Gửi đăng ký
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BloodRequestForm;
