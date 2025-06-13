import React, { useEffect, useState } from "react";
import { Users, Heart, Activity, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";

const OverviewPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    requests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, eventRes, requestRes] = await Promise.all([
          api.get ("/api/users/count"),
          api.get("/api/events/count"),
          api.get("/api/requests/count"),
        ]);
        setStats({
          users: userRes.data.count,
          events: eventRes.data.count,
          requests: requestRes.data.count,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      }
    };

    fetchStats();
  }, []);
  const userSelect= useSelector((state) => state.user);

  const chartData = [
    { name: "Tháng 1", donate: 120 },
    { name: "Tháng 2", donate: 98 },
    { name: "Tháng 3", donate: 130 },
    { name: "Tháng 4", donate: 85 },
    { name: "Tháng 5", donate: 150 },
    { name: "Tháng 6", donate: 170 },
  ];

  const summaryItems = [
    {
      label: "Người đăng ký",
      value: stats.users,
      icon: <Users className="w-6 h-6 text-red-500" />,
    },
    {
      label: "Sự kiện",
      value: stats.events,
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
    },
    {
      label: "Yêu cầu máu",
      value: stats.requests,
      icon: <Heart className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-white to-red-50">

      <p className="text-center text-xl sm:text-2xl font-semibold text-gray-600 mb-10">
  Tổng quan hoạt động hiến máu
</p>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100 border">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {item.value}
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Biểu đồ lượt hiến máu theo tháng
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="donate" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewPage;
