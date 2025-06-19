import React, { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../../configs/axios";

const BloodDonationList = () => {
  const [donors, setDonors] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("/blood-donations"); 
      setDonors(response.data);
    } catch (error) {
      console.error("Failed to fetch donor list", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Ngày sinh", dataIndex: "birthDate", key: "birthDate" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Danh sách người đăng ký hiến máu
        </h2>
        <Table
          dataSource={donors.map((item, index) => ({ ...item, key: index }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default BloodDonationList;
