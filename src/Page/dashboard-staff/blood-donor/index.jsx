import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Descriptions, Select, message } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const { Option } = Select;

const statusOptions = ["Đang chờ duyệt", "đã đặt lịch", "Từ chối"];

const BloodDonationListt = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get("Admin/donations");
      setData(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      toast.error("Không thể tải dữ liệu hiến máu.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (donationId, newStatus) => {
    try {
      await api.put(`Admin/donations/${donationId}/status`, {
        donationId: donationId,
        status: newStatus,
      });
      toast.success("Cập nhật trạng thái thành công");
      fetchData();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error("Không thể cập nhật trạng thái.");
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
          value={record.status}
          style={{ width: 200 }}
          onChange={(value) => handleUpdateStatus(record.donationId, value)}
        >
          {statusOptions.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey="donationId" />

      <Modal
        title="Thông tin chi tiết"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Chiều cao">
              {selectedRecord.height} cm
            </Descriptions.Item>
            <Descriptions.Item label="Cân nặng">
              {selectedRecord.weight} kg
            </Descriptions.Item>
            <Descriptions.Item label="Bệnh mãn tính">
              {selectedRecord.chronicDisease || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Thuốc đang dùng">
              {selectedRecord.medication || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default BloodDonationListt;
