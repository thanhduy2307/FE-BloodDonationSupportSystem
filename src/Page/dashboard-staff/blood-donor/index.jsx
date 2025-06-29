import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Popconfirm } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const BloodDonationList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchBloodType, setSearchBloodType] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("User/donations");
      console.log("Data:", response.data); // debug
      setDonors(response.data);
      setFilteredDonors(response.data);
    } catch (error) {
      console.error("Fetch error", error);
      toast.error("Không tải được danh sách");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = donors.filter((item) =>
      item.bloodType?.toLowerCase().includes(searchBloodType.toLowerCase())
    );
    setFilteredDonors(filtered);
  };

const handleUpdateStatus = async (donationId, newStatus) => {
  try {
    await api.put(`Admin/donations/${donationId}/status`, newStatus, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Cập nhật trạng thái thành công");
    fetchData(); // reload lại bảng
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái:", error);
    toast.error("Không thể cập nhật trạng thái");
  }
};

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Ngày sinh", dataIndex: "birthDate", key: "birthDate" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bản ghi này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger type="link">
            Xóa
          </Button>
        </Popconfirm>
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
<p>Test: Đang hiển thị layout</p>

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

export default BloodDonationList;
