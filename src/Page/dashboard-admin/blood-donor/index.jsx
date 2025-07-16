import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const BloodDonationList = () => {
  const [donations, setDonations] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("Admin/donations");
      const dataWithKey = response.data.map((item, index) => ({
        ...item,
        key: item.donationId || index,
      }));
      setDonations(dataWithKey);
    } catch (error) {
      console.error("❌ Failed to fetch donations", error);
      toast.error("Không thể tải danh sách hiến máu.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "donationId",
      key: "donationId",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "userId",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày hiến",
      dataIndex: "donationDate",
      key: "donationDate",
    },
    {
      title: "Giờ hiến",
      dataIndex: "donationTime",
      key: "donationTime",
    },
   {
  title: "Trạng thái",
  dataIndex: "status",
  key: "status",
  render: (status) => {
  const statusTextMap = {
    pending: "Chờ duyệt",
    completed: "Đã duyệt",
    cancelled: "Từ chối",
  };

  const normalized = (status || "").toLowerCase().trim();

  return (
    <Tag color="default">
      {statusTextMap[normalized] || status || "Không rõ"}
    </Tag>
  );
}
}

  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Danh sách đăng ký hiến máu
        </h2>
        <Table
          dataSource={donations}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default BloodDonationList;
