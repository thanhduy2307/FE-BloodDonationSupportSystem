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
import { useNavigate } from "react-router-dom";

const EventTable = ({ data, onView, onEdit, onDelete, onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [Event,setEvent]= useState()
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
const navigate = useNavigate()
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async() => {
    try {
        await api.post("event");
        toast.success("Tạo sự kiện thành công!");
        navigate("/eventStaff");
      } catch (error) {
        console.error(error);
        toast.error("Đã có lỗi xảy ra khi tạo mới.");
      }
   
  };
  const fetchEvent= async ()=>{
    try {
        const response = await api.get('event')
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
      title: "Tên sự kiện",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày ",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
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
        dataSource={data}
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
