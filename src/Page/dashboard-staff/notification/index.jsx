import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import dayjs from "dayjs";
import api from "../../../configs/axios";

const { Option } = Select;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notiRes, userRes, eventRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/users"),
        api.get("/events"),
      ]);
      setNotifications(notiRes.data);
      setUsers(userRes.data);
      setEvents(eventRes.data);
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
    };

    try {
      if (editingNotification) {
        await api.put(`/notifications/${editingNotification.notificationId}`, payload);
        message.success("Cập nhật thông báo thành công");
      } else {
        await api.post("/notifications", payload);
        message.success("Tạo thông báo thành công");
      }
      closeModal();
      fetchData();
    } catch {
      message.error("Lỗi khi lưu thông báo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      message.success("Đã xóa");
      fetchData();
    } catch {
      message.error("Lỗi khi xóa");
    }
  };

  const columns = [
    {
      title: "Người nhận",
      dataIndex: ["user", "fullName"],
      key: "user",
    },
    {
      title: "Sự kiện",
      dataIndex: ["event", "eventName"],
      key: "event",
      render: (text) => text || "Không có",
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
    {
      title: "Yêu cầu phản hồi",
      dataIndex: "isActionRequired",
      key: "isActionRequired",
      render: (v) => (v ? "Có" : "Không"),
    },
    {
      title: "Phản hồi",
      dataIndex: "responseStatus",
      key: "responseStatus",
      render: (s) => s || "Chưa phản hồi",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.notificationId)}
          >
            <Button danger type="link">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Thông báo đã gửi</h2>
          <Button type="primary" onClick={openCreateModal}>Tạo mới</Button>
        </div>

        <Table
          dataSource={notifications.map((n) => ({ ...n, key: n.notificationId }))}
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
          <Form.Item name="userId" label="Người nhận" rules={[{ required: true }]}>  
            <Select placeholder="Chọn người dùng">
              {users.map((u) => (
                <Option key={u.userId} value={u.userId}>{u.fullName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="eventId" label="Sự kiện (tuỳ chọn)">
            <Select placeholder="Liên kết sự kiện" allowClear>
              {events.map((e) => (
                <Option key={e.eventId} value={e.eventId}>{e.eventName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="message" label="Nội dung" rules={[{ required: true }]}>  
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="notifDate" label="Ngày gửi" rules={[{ required: true }]}>  
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item name="isActionRequired" label="Yêu cầu phản hồi" initialValue={false}>
            <Select>
              <Option value={false}>Không</Option>
              <Option value={true}>Có</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;
