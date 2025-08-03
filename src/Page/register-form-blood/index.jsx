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
    hasDonatedBefore: "",
    lastDonationDate: "",
    isPregnant: "",
    hasInfectiousDisease: "",
    height: "",
    weight: "",
    hasApprovedDonation: false,
    hasPendingDonation: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, donationRes] = await Promise.all([
          api.get("/User/profile"),
          api.get("/User/donations"),
        ]);

        const bloodType = profileRes?.data?.bloodGroup;

        if (!bloodType) {
          toast.error("Vui lòng cập nhật nhóm máu trong hồ sơ trước khi đăng ký hiến máu.");
          navigate("/profile");
          return;
        }

        const history = donationRes?.data || [];

        const pending = history.find((d) => d.status === "Chờ duyệt");
        if (pending) {
          toast.warn("🚫 Bạn đã có một đơn đăng ký đang chờ duyệt. Không thể tiếp tục.");
          setFormData((prev) => ({
            ...prev,
            bloodType,
            hasPendingDonation: true,
          }));
          return;
        }

        const approvedDonations = history.filter((d) => d.status === "approved");
        const hasApprovedDonation = approvedDonations.length > 0;
        const latestDonation = hasApprovedDonation
          ? approvedDonations.sort(
              (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
            )[0]
          : null;

        setFormData((prev) => ({
          ...prev,
          bloodType,
          hasDonatedBefore: hasApprovedDonation ? "yes" : "",
          lastDonationDate: latestDonation?.donationDate || "",
          hasApprovedDonation: hasApprovedDonation,
        }));
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
        message.error("Không thể tải thông tin hồ sơ");
      }
    };

    fetchData();
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

    const time = formData.donationTime;
    if (!time) {
      toast.error("❌ Vui lòng chọn giờ hiến máu!");
      return;
    }

    const [hour, minute] = time.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    const minMinutes = 7 * 60;
    const maxMinutes = 16 * 60 + 30;

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      toast.error("⏰ Giờ hiến máu chỉ được phép từ 07:00 đến 16:30!");
      return;
    }

    if (
      formData.hasDonatedBefore === "yes" &&
      formData.lastDonationDate &&
      dayjs(formData.donationDate).diff(dayjs(formData.lastDonationDate), "day") < 84
    ) {
      toast.error(
        `❌ Ngày hiến gần nhất (${formData.lastDonationDate}) chưa đủ 12 tuần!`
      );
      return;
    }

    try {
      const data = {
        bloodType: formData.bloodType,
        quantity: Number(formData.quantity),
        donationDate: formData.donationDate,
        donationTime: time.length === 5 ? `${time}:00` : time,
        hasDonatedBefore: formData.hasDonatedBefore,
        lastDonationDate: formData.lastDonationDate,
        isPregnant: formData.isPregnant,
        hasInfectiousDisease: formData.hasInfectiousDisease,
        height: formData.height,
        weight: formData.weight,
      };

      await api.post("/User/donate", data);
      toast.success("🎉 Đăng ký thành công!");
      message.success("✅ Đăng ký hiến máu thành công!");

      setFormData((prev) => ({
        ...prev,
        quantity: 250,
        donationDate: dayjs().format("YYYY-MM-DD"),
        donationTime: "",
        isPregnant: "",
        hasInfectiousDisease: "",
        height: "",
        weight: "",
      }));
    } catch (err) {
      console.error("❌ Lỗi gửi đăng ký:", err);
      toast.error("🚨 Gửi đăng ký thất bại!");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4 pt-24">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl relative">
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 bg-white text-red-600 font-semibold px-4 py-2 rounded shadow hover:bg-red-100 transition z-50"
        >
          ← Về trang chủ
        </button>

        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Phiếu đăng ký hiến máu
        </h2>

        {formData.hasPendingDonation ? (
          <div className="text-center text-red-600 text-lg font-semibold py-12">
            🚫 Bạn đã có một đơn đăng ký đang chờ duyệt. Không thể gửi thêm!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input type="hidden" name="bloodType" value={formData.bloodType} />

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Lượng máu (ml)</label>
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

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Chiều cao (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min={100}
                max={250}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Nhập chiều cao"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cân nặng (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min={30}
                max={200}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Nhập cân nặng"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Ngày hiến máu</label>
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

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Giờ hiến máu</label>
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

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Đã từng hiến máu chưa?</label>
              {formData.hasApprovedDonation ? (
                <input
                  type="text"
                  value="Đã từng"
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-red-300 rounded-md text-gray-500 cursor-not-allowed"
                />
              ) : (
                <select
                  name="hasDonatedBefore"
                  value={formData.hasDonatedBefore}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">-- Chọn --</option>
                  <option value="no">Chưa</option>
                  <option value="yes">Đã từng</option>
                </select>
              )}
            </div>

            {formData.hasDonatedBefore === "yes" && formData.lastDonationDate && (
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Ngày hiến gần nhất</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-red-300 rounded-md text-gray-500 cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Có đang mang thai không?</label>
              <select
                name="isPregnant"
                value={formData.isPregnant}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">-- Chọn --</option>
                <option value="no">Không</option>
                <option value="yes">Có</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Có bệnh truyền nhiễm không?</label>
              <select
                name="hasInfectiousDisease"
                value={formData.hasInfectiousDisease}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">-- Chọn --</option>
                <option value="no">Không</option>
                <option value="yes">Có</option>
              </select>
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

export default BloodDonationForm;