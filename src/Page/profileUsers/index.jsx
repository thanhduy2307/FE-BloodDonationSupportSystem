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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  HomeOutlined,
  HeartOutlined,
  EditOutlined,
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
  const [user, setUser] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load user profile từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {

       

        const response = await api.get("User/profile");

        setUser(response.data);
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
      gender: user.profile?.gender,
      dateOfBirth: user.profile?.dateOfBirth ? dayjs(user.profile.dateOfBirth) : null,
      bloodGroup: user.profile?.bloodGroup,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = {
          ...values,
          dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        };

        const res = await api.put("profile", payload);
        setUser(res.data);
        toast.success("Cập nhật hồ sơ thành công!");
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        toast.error("Cập nhật thất bại!");
      }
    });
  };

  if (!user) return null;

  const profile = user.profile || {};

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
            <Avatar size={120} icon={<UserOutlined />} />
            <div style={{ marginTop: 10 }}>
              <Tag color="blue">{user.role}</Tag>
            </div>
          </Col>

          <Col xs={24} md={18}>
            <Title level={3} style={{ marginBottom: 0 }}>
              {user.fullName}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              @{user.username}
            </Text>

            <Divider style={{ margin: "24px 0" }} />

            <InfoItem label="Email" value={user.email} icon={<MailOutlined />} />
            <InfoItem label="Giới tính" value={profile.gender} icon={<IdcardOutlined />} />
            <InfoItem label="Ngày sinh" value={profile.dateOfBirth} icon={<IdcardOutlined />} />
            <InfoItem label="Địa chỉ" value={profile.address} icon={<HomeOutlined />} />
            <InfoItem label="Nhóm máu" value={profile.bloodGroup} icon={<HeartOutlined />} />
            <InfoItem label="Hiến máu gần nhất" value={profile.lastDonationDate} icon={<HeartOutlined />} />
            <InfoItem label="Nhận máu gần nhất" value={profile.lastReceivedDate} icon={<HeartOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* Modal Chỉnh sửa */}
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
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
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
