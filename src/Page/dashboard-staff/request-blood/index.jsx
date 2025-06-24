import React, { useEffect, useState } from "react";
import { Table, Tag, Select, message } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/axios";

const { Option } = Select;

const BloodRequestList = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/bloodrequests");
      setRequests(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách yêu cầu máu!");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionChange = async (value, record) => {
    try {
      await api.put(`/bloodrequests/${record.id}/status`, { status: value });

      toast.success(`Đã ${value === "approve" ? "phê duyệt" : "từ chối"} yêu cầu thành công!`);

      // Sau khi cập nhật thành công, làm mới lại danh sách
      fetchRequests();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

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
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Select
          placeholder="Chọn hành động"
          style={{ width: 160 }}
          onChange={(value) => handleActionChange(value, record)}
        >
          <Option value="approve">Phê duyệt</Option>
          <Option value="reject">Từ chối</Option>
        </Select>
      ),
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
