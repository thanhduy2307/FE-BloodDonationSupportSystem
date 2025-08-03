import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Select, Modal } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const { Option } = Select;

const statusMapping = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  cancel: "Hủy",
};

const reverseStatusMapping = {
  "Chờ duyệt": "pending",
  "Đã duyệt": "approved",
  "Từ chối": "rejected",
  "Hủy": "cancel",
};

const BloodDonationListt = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchBloodType, setSearchBloodType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Cập nhật trạng thái thành công");
      fetchData();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
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
      title: "Thông tin bổ sung",
      key: "extraInfo",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={statusMapping[text] || text}
          style={{ width: 150 }}
          onChange={(value) =>
            handleUpdateStatus(
              record.donationId,
              reverseStatusMapping[value]
            )
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

        <Modal
          title="Thông tin bổ sung"
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
        >
          {selectedRecord && (
            <div>
              <p>Chiều cao: {selectedRecord.height} cm</p>
              <p>Cân nặng: {selectedRecord.weight} kg</p>
              <p>
                Có mang thai:{" "}
                {selectedRecord.isPregnant === "yes" ? "Có" : "Không"}
              </p>
              <p>
                Bệnh truyền nhiễm:{" "}
                {selectedRecord.hasInfectiousDisease === "yes"
                  ? "Có"
                  : "Không"}
              </p>
              <p>
                Đã hiến máu trước đó:{" "}
                {selectedRecord.hasDonatedBefore
                  ? `Có (ngày ${
                      selectedRecord.lastDonationDate || "Không rõ"
                    })`
                  : "Chưa"}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BloodDonationListt;
