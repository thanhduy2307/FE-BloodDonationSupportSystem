import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const { Option } = Select;

// Ánh xạ giữa status tiếng Anh và tiếng Việt
const statusMapping = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const reverseStatusMapping = {
  "Chờ duyệt": "pending",
  "Đã duyệt": "approved",
  "Từ chối": "rejected",
};

const BloodDonationListt = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchBloodType, setSearchBloodType] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("Admin/donations");
      setDonors(response.data);
      setFilteredDonors(response.data);
    } catch (error) {
      console.error("Lỗi tải danh sách", error);
      toast.error("Không tải được danh sách");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = donors.filter((item) =>
      item.bloodGroup?.toLowerCase().includes(searchBloodType.toLowerCase())
    );
    setFilteredDonors(filtered);
  };

  const handleUpdateStatus = async (donationId, value) => {
    try {
      await api.put(
        `Admin/donations/${donationId}/status`,
        `"${value}"`,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Cập nhật trạng thái thành công");
      fetchData();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    { title: "Mã người dùng", dataIndex: "userId", key: "userId" },
    { title: "Họ tên", dataIndex: "fullname", key: "fullname" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    { title: "Nhóm máu", dataIndex: "bloodGroup", key: "bloodGroup" },
    { title: "Số lượng (ml)", dataIndex: "quantity", key: "quantity" },
    { title: "Ngày hiến", dataIndex: "donationDate", key: "donationDate" },
    { title: "Giờ hiến", dataIndex: "donationTime", key: "donationTime" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={statusMapping[text] || text} // Hiển thị tiếng Việt
          style={{ width: 150 }}
          onChange={(value) =>
            handleUpdateStatus(record.donationId, reverseStatusMapping[value])
          }
        >
          {Object.values(statusMapping).map((label) => (
            <Option key={label} value={label}>
              {label}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Danh sách người đăng ký hiến máu
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
          dataSource={filteredDonors.map((item, index) => ({
            ...item,
            key: item.id || index,
          }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default BloodDonationListt;
