import React, { useEffect, useState } from "react";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const BloodRequestList = () => {
  const [requests, setRequests] = useState([]);
const [searchBloodType, setSearchBloodType] = useState("");
const [filteredDonors, setFilteredDonors] = useState([]);
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
const handleChangeStatus = async (requestId, newStatus) => {
  try {
    await api.put(`Admin/requests/${requestId}/status`, newStatus, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Cập nhật trạng thái thành công!");
    fetchRequests();
  } catch (error) {
    console.error(error);
    toast.error("Cập nhật trạng thái thất bại!");
  }
};
const handleSearch = () => {
    const filtered = donors.filter((item) =>
      item.bloodGroup?.toLowerCase().includes(searchBloodType.toLowerCase())
    );
    setFilteredDonors(filtered);
  };  
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
  title: "Cập nhật trạng thái",
  key: "action",
  render: (_, record) => (
    <Select
      defaultValue={record.status}
      style={{ width: 140 }}
      onChange={(value) => handleChangeStatus(record.requestId, value)}
    >
      <Select.Option value="pending">Pending</Select.Option>
      <Select.Option value="approved">Approved</Select.Option>
      <Select.Option value="rejected">Rejected</Select.Option>
    </Select>
  ),
},
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Danh sách yêu cầu nhận máu
        </h2>
         <Space className="mb-4">
          <Input
            placeholder="Tìm theo nhóm máu (A, B, AB, O...)"
            value={searchBloodType}
            onChange={(e) => setSearchBloodType(e.target.value)}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space>
        <Table
          dataSource={requests}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default BloodRequestList;
