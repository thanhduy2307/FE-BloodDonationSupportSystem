import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/axios";

const BloodRequestList = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/bloodrequests");
        setRequests(res.data);
      } catch (err) {
        toast.error("Không thể tải danh sách yêu cầu máu!");
      }
    };

    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: ["user", "fullName"],
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (group) => <Tag color="red">{group}</Tag>,
    },
    {
      title: "Số lượng (đơn vị)",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 px-4 pt-6">

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Danh sách yêu cầu máu
        </h2>
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default BloodRequestList;
