import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const BloodRequestListAdmin = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await api.get("Admin/requests");
      const mapped = response.data.map((item) => ({
        ...item,
        key: item.requestId,
      }));
      setRequests(mapped);
    } catch (error) {
      console.error("❌ Error fetching blood requests:", error);
      toast.error("Không thể tải danh sách yêu cầu máu.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "requestId", key: "requestId" },
    { title: "Người yêu cầu", dataIndex: "fullname", key: "fullname" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    { title: "Nhóm máu", dataIndex: "bloodGroup", key: "bloodGroup" },
    { title: "Số lượng (ml)", dataIndex: "quantity", key: "quantity" },
    { title: "Ngày yêu cầu", dataIndex: "requestDate", key: "requestDate" },
    { title: "Giờ yêu cầu", dataIndex: "requestTime", key: "requestTime" },
     {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
  const statusTextMap = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
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
          Danh sách yêu cầu nhận máu
        </h2>
        <Table
          dataSource={requests}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default BloodRequestListAdmin;
