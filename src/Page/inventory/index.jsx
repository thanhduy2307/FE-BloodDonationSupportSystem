import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, message } from "antd";
import api from "../../configs/axios"; // Đường dẫn đến axios config của bạn
import dayjs from "dayjs";

const { Title } = Typography;

const BloodStoragePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStorage = async () => {
    try {
      setLoading(true);
      const res = await api.get("/BloodStorage/list");
      setData(res.data); // Đảm bảo API trả về đúng format
    } catch (err) {
      message.error("Lỗi khi tải kho máu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Mã người hiến",
      dataIndex: "donorId",
      key: "donorId",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (type) => <Tag color="red">{type}</Tag>,
    },
    {
      title: "Thể tích (ml)",
      dataIndex: "volume",
      key: "volume",
    },
    {
      title: "Ngày nhập kho",
      dataIndex: "donationDate",
      key: "donationDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Kho máu hiện có</Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BloodStoragePage;
