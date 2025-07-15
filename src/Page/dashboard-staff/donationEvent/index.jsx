import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const EventTable = ({ onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [form] = Form.useForm(); // Thêm dòng này

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset khi đóng modal
  };

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        eventDate: formData.eventDate.format("YYYY-MM-DD"),
      };

      await api.post("Event/create", payload);
      toast.success("Tạo sự kiện thành công!");
      handleCloseModal();
      form.resetFields(); // Reset sau khi tạo thành công
      fetchEvent();
    } catch (error) {
      console.error("❌ Lỗi tạo sự kiện:", error?.response?.data || error);
      toast.error("Đã có lỗi xảy ra khi tạo mới.");
    }
  };

  const handleEdit = (record) => {
    setSelectedEvent({
      ...record,
      eventDate: record.eventDate ? dayjs(record.eventDate) : null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
      };
      await api.put(`Event/update/${selectedEvent.eventId}`, payload);
      toast.success("Cập nhật sự kiện thành công!");
      setIsEditModalOpen(false);
      fetchEvent();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (record) => {
    try {
      await api.delete(`Event/delete/${record.eventId}`);
      toast.success("Xóa sự kiện thành công!");
      fetchEvent();
    } catch (error) {
      console.error("❌ Lỗi xóa:", error);
      toast.error("Không thể xóa sự kiện");
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await api.get("Event/getAll");
      setEventList(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch Event");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const columns = [
    {
      title: "ID sự kiện",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Chủ đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày",
      dataIndex: "eventDate",
      key: "eventDate",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sự kiện này?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách sự kiện</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Tạo sự kiện
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={eventList}
        rowKey={(record) => record.eventId}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal tạo sự kiện */}
      <Modal
        title="Tạo sự kiện mới"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleFormSubmit} form={form}>
          <Form.Item
            name="title"
            label="Chủ đề"
            rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="eventDate"
            label="Ngày diễn ra"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={current => current && current < dayjs().startOf('day')}
              // Không cho chọn ngày trong quá khứ
            />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={handleCloseModal} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa sự kiện */}
      <Modal
        title="Chỉnh sửa sự kiện"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={selectedEvent}
          onFinish={handleEditSubmit}
          key={selectedEvent?.eventId}
        >
          <Form.Item
            name="title"
            label="Chủ đề"
            rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="eventDate"
            label="Ngày diễn ra"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsEditModalOpen(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EventTable;
