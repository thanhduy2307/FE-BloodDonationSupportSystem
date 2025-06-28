import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Avatar,
  Row,
  Col,
  Divider,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  HomeOutlined,
  HeartOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const InfoItem = ({ label, value, icon }) => (
  <Row style={{ marginBottom: 16 }} align="middle">
    <Col span={2}>{icon}</Col>
    <Col span={22}>
      <Text strong>{label}:</Text> <Text>{value || "Chưa có"}</Text>
    </Col>
  </Row>
);

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null); // ảnh đại diện tạm

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("User/profile");
        setUser(response.data);
        setAvatarUrl(response.data.avatarUrl || null); // nếu có sẵn avatar
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast.error("Không thể tải hồ sơ!");
      }
    };
    fetchProfile();
  }, []);

  const showModal = () => {
    if (!user) return;

    form.setFieldsValue({
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      bloodGroup: user.bloodGroup,
      address: user.address,
      lastDonationDate: user.lastDonationDate
        ? dayjs(user.lastDonationDate)
        : null,
      lastReceivedDate: user.lastReceivedDate
        ? dayjs(user.lastReceivedDate)
        : null,
    });

    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = {
          ...user,
          ...values,
          avatarUrl: avatarUrl, // nếu muốn gửi avatar URL về server
          dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
          lastDonationDate: values.lastDonationDate?.format("YYYY-MM-DD"),
          lastReceivedDate: values.lastReceivedDate?.format("YYYY-MM-DD"),
        };

        const response = await api.put("User/updateProfile", payload);
        setUser(response.data);
        toast.success("Cập nhật hồ sơ thành công!");
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        toast.error("Cập nhật thất bại!");
      }
    });
  };

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result); // hiển thị ngay trên UI
    };
    reader.readAsDataURL(file);

    // Nếu backend có API upload ảnh, thì call tại đây
    // const formData = new FormData();
    // formData.append("avatar", file);
    // await api.post("/upload/avatar", formData)
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f2f5, #e0e7ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "1000px",
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          position: "relative",
        }}
        bodyStyle={{ padding: "40px" }}
      >
        <Button
          icon={<EditOutlined />}
          type="primary"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            borderRadius: "999px",
            padding: "0 16px",
          }}
          onClick={showModal}
        >
          Chỉnh sửa hồ sơ
        </Button>

        <Row gutter={24} align="middle">
          <Col xs={24} md={6} style={{ textAlign: "center", marginBottom: 20 }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={avatarUrl}
              style={{ objectFit: "cover" }}
            />
            <div style={{ marginTop: 10 }}>
              <Tag color="blue">{user.roleName}</Tag>
            </div>
          </Col>

          <Col xs={24} md={18}>
            <Title level={3} style={{ marginBottom: 0 }}>
              {user.fullname}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              @{user.phoneNumber}
            </Text>

            <Divider style={{ margin: "24px 0" }} />

            <InfoItem label="Email" value={user.email} icon={<MailOutlined />} />
            <InfoItem label="Giới tính" value={user.gender} icon={<IdcardOutlined />} />
            <InfoItem label="Ngày sinh" value={user.dateOfBirth} icon={<IdcardOutlined />} />
            <InfoItem label="Địa chỉ" value={user.address} icon={<HomeOutlined />} />
            <InfoItem label="Nhóm máu" value={user.bloodGroup} icon={<HeartOutlined />} />
            <InfoItem label="Hiến máu gần nhất" value={user.lastDonationDate} icon={<HeartOutlined />} />
            <InfoItem label="Nhận máu gần nhất" value={user.lastReceivedDate} icon={<HeartOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Ảnh đại diện">
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {avatarUrl && (
              <Avatar
                src={avatarUrl}
                size={80}
                style={{ marginTop: 10, border: "1px solid #ccc" }}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Nhóm máu" name="bloodGroup">
            <Select>
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Hiến máu gần nhất" name="lastDonationDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Nhận máu gần nhất" name="lastReceivedDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
