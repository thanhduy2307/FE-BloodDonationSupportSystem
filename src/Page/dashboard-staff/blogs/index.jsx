import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Modal, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../configs/axios";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await api.get("Blog/getAllBlog");
      setBlogs(res.data.data);
    } catch {
      message.error("Không thể tải danh sách blog!");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // const handleDelete = async (id) => {
  //   try {
  //     await api.delete(`/blogs/${id}`);
  //     message.success("Xoá thành công!");
  //     fetchBlogs();
  //   } catch {
  //     message.error("Xoá thất bại!");
  //   }
  // };

//   const openCreateModal = () => {
//     form.resetFields();
//     setIsEditing(false);
//     setCurrentBlog(null);
//     setModalVisible(true);
//   };

//   const openEditModal = async (blog) => {
//   try {
//     const res = await api.get(`/blogs/${blog.id}`);
//     const blogData = res.data;

//     form.setFieldsValue({
//       title: blogData.title,
//       image: blogData.image,
//       link: blogData.link,
//       description: blogData.description,
//     });

//     setCurrentBlog(blog);
//     setIsEditing(true);
//     setModalVisible(true);
//   } catch (err) {
//     console.error("❌ Lỗi khi load blog:", err);
//     message.error("Không thể tải dữ liệu bài viết!");
//   }
// };

  // const handleSubmit = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     if (isEditing && currentBlog) {
  //       await api.put(`/Blog/update/${currentBlog.id}`, values);
  //       message.success("Cập nhật thành công!");
  //     } else {
  //       await api.post("/Blog/create", values);
  //       message.success("Tạo bài viết thành công!");
  //     }

  //     setModalVisible(false);
  //     fetchBlogs();
  //   } catch {
  //     message.error("Có lỗi xảy ra!");
  //   }
  // };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="font-medium text-red-600">{text}</span>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: ["author", "fullName"],
      key: "author",
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => navigate(`/blogs/${record.id}`)}>
            Xem
          </Button>
          {/* <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button> */}
          {/* <Popconfirm
            title="Bạn có chắc muốn xoá?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm> */}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 px-4 pt-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">Quản lý Blog</h2>
          <Button
            type="primary"
            className="bg-red-600"
            // onClick={openCreateModal}
          >
            + Tạo mới
          </Button>
        </div>

        <Table
          dataSource={blogs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* <Modal
        title={isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText={isEditing ? "Cập nhật" : "Đăng bài"}
        cancelText="Huỷ"
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh (URL)"
            rules={[
              { required: true, message: "Vui lòng nhập đường dẫn ảnh!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="link"
            label="Liên kết bài viết"
            rules={[{ required: true, message: "Vui lòng nhập link!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default ManageBlogs;
