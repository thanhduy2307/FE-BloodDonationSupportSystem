import { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Modal } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreateBloodEvent from "./formCreateEvent";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const EventTable = ({ data, onView, onEdit, onDelete, onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [Event,setEvent]= useState()
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async(formData) => {
    try {
        await api.post("Event/create",formData);
        toast.success("Tạo sự kiện thành công!");
        handleCloseModal(true)
      } catch (error) {
        console.error(error);
        toast.error("Đã có lỗi xảy ra khi tạo mới.");
      }
   
  };
  const fetchEvent= async ()=>{
    try {
        const response = await api.get('Event/getAll')
        setEvent(response.data)

    } catch (error) {
        console.log(error)
        toast.error('Failed to fetch Event')
    }   
  }
   useEffect(() => {
      fetchEvent();
    }, []);

  const columns = [
    {
      title: "ID sự kiện",
      dataIndex: "enventId",
      key: "name",
    },
    {
      title: "Chủ đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title:"Ngày",
      dataIndex: "eventDate",
      key: "eventDate",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record)}
          />
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
        dataSource={Event}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Tạo sự kiện mới"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <CreateBloodEvent onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default EventTable;
