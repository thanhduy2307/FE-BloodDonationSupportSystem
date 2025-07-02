import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const notiRes = await api.get("/Notification/getAll");
      setNotifications(notiRes.data);
    } catch {
      message.error("Lỗi khi tải dữ liệu.");
    }
  };

  const openCreateModal = () => {
    setEditingNotification(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingNotification(record);
    form.setFieldsValue({
      ...record,
      notifDate: dayjs(record.notifDate),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setEditingNotification(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
  const payload = {
    ...values,
    notifDate: values.notifDate.format("YYYY-MM-DD"),
    userId: values.userId?.trim() ? values.userId.trim() : null,
    eventId: values.eventId?.trim() ? values.eventId.trim() : null,
  };

  console.log("Payload gửi:", payload); // ✅ Kiểm tra lại giá trị gửi đi

  try {
    if (editingNotification) {
      await api.put(
        `/notifications/${editingNotification.notificationId}`,
        payload
      );
      message.success("Cập nhật thông báo thành công");
    } else {
      await api.post("Notification/create", payload);
      toast.success("Tạo thông báo thành công");
    }
    closeModal();
    fetchData();
  } catch {
    toast.error("Lỗi khi lưu thông báo");
  }
};


  const columns = [
    {
      title: "ID Người nhận",
      dataIndex: "userId",
      key: "userId",
      render: (id) => id ?? "Tất cả",
    },
    {
      title: "ID Sự kiện",
      dataIndex: "eventId",
      key: "eventId",
      render: (id) => id ?? "Không có",
    },
    {
      title: "Thông báo",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Ngày gửi",
      dataIndex: "notifDate",
      key: "notifDate",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Thông báo đã gửi</h2>
          <Button type="primary" onClick={openCreateModal}>
            Tạo mới
          </Button>
        </div>

        <Table
          dataSource={notifications.map((n) => ({
            ...n,
            key: n.notificationId,
          }))}
          columns={columns}
          pagination={{ pageSize: 6 }}
        />
      </div>

      <Modal
        title={editingNotification ? "Cập nhật thông báo" : "Tạo thông báo"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editingNotification ? "Cập nhật" : "Tạo"}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="userId" label="ID người nhận">
            <Input placeholder="Nhập userId (bỏ trống để gửi cho tất cả)" />
          </Form.Item>

          <Form.Item name="eventId" label="ID sự kiện">
            <Input placeholder="Nhập eventId (nếu có)" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="notifDate"
            label="Ngày gửi"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;
