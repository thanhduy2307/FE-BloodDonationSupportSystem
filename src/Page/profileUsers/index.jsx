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
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState(null); // Sửa về null
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false); // Sửa về false
  const [avatarUrl, setAvatarUrl] = useState(null); // Sửa về null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("User/profile");
        setUser(response.data);
        setAvatarUrl(response.data.avatarUrl || null);
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
          avatarUrl: avatarUrl,
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
      setAvatarUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to right, #f0f2f5, #e0e7ff)"
    }}>
      <div style={{fontSize: 20, color: "#888"}}>Đang tải hồ sơ...</div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 10px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          backgroundColor: "#fff",
          position: "relative",
        }}
        bodyStyle={{ padding: "36px 24px" }}
      >
        <div style={{ display: "flex", gap: 12, position: "absolute", top: 18, right: 18 }}>
          <Button
            icon={<EditOutlined />}
            type="primary"
            style={{
              borderRadius: "999px",
              padding: "0 18px",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(255,0,0,0.08)"
            }}
            onClick={showModal}
          >
            Chỉnh sửa hồ sơ
          </Button>
          <Button
            type="default"
            style={{
              borderRadius: 20,
              fontWeight: 500,
              background: "#f7fafc"
            }}
            onClick={() => navigate("/history")}
          >
            Xem lịch sử hiến và nhận máu
          </Button>
        </div>

        <Row gutter={[32, 16]} align="middle" style={{marginTop: 24}}>
          <Col xs={24} md={7} style={{ textAlign: "center", marginBottom: 20 }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={avatarUrl}
              style={{
                objectFit: "cover",
                border: "3px solid #e0e7ff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}
            />
            <div style={{ marginTop: 12 }}>
              <Tag color="blue" style={{fontSize: 16, padding: "4px 16px"}}>{user.roleName}</Tag>
            </div>
          </Col>

          <Col xs={24} md={17}>
            <Title level={3} style={{ marginBottom: 0, color: "#d7263d" }}>
              {user.fullname}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              @{user.phoneNumber}
            </Text>

            <Divider style={{ margin: "18px 0" }} />

            <InfoItem
              label="Email"
              value={user.email}
              icon={<MailOutlined />}
            />
            <InfoItem
              label="Giới tính"
              value={user.gender}
              icon={<IdcardOutlined />}
            />
            <InfoItem
              label="Ngày sinh"
              value={user.dateOfBirth}
              icon={<IdcardOutlined />}
            />
            <InfoItem
              label="Địa chỉ"
              value={user.address}
              icon={<HomeOutlined />}
            />
            <InfoItem
              label="Nhóm máu"
              value={user.bloodGroup}
              icon={<HeartOutlined />}
            />
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
        centered
        bodyStyle={{paddingTop: 16}}
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
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
