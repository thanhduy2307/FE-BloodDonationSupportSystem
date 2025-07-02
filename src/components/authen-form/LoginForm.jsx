import React from "react";
import { Form, Input, Button, Checkbox } from "antd";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Lock } from "lucide-react";

import { Link } from "react-router-dom";
import { login } from "../../redux/features/userSlice";
import api from "../../configs/axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const response = await api.post("Auth/login", values);

      const { token, ...user } = response.data;

      toast.success("Đăng nhập thành công!");

      dispatch(login(user));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role == "Admin") {
        navigate("/dashboard/overview");
      } else if (user.role == "User") {
        navigate("/");
      } else if (user.role == "Staff") {
        navigate("/dashboard-staff/member-staff");
      }
      console.log("User role:", user.role);
    } catch (e) {
  console.error("🧨 Lỗi đầy đủ:", e);

  const data = e?.response?.data;

  // 1. In thử để chắc chắn có gì trong data
  console.log("📦 e.response.data:", data);

  // 2. Nếu có lỗi dạng validation
  if (data && typeof data === "object" && data.errors) {
    const allErrors = Object.values(data.errors).flat();
    console.log("📢 Toàn bộ lỗi cần hiển thị:", allErrors);

    allErrors.forEach((msg) => {
      toast.error(msg);
    });
  } else if (typeof data === "string") {
    toast.error(data.data);
  } else if (data.data?.message) {
    toast.error(data.data.message);
  } else {
    toast.error("Lỗi không xác định từ máy chủ.");
  }
}

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-6">
            <User className="text-red-600 mr-2" size={32} />
            <span className="text-2xl font-bold text-red-600">HeartDrop</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-gray-600">
            Chào mừng bạn trở lại với cộng đồng hiến máu nhân đạo
          </p>
        </div>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<User className="text-gray-400 mr-2" size={16} />}
              placeholder="Tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<Lock className="text-gray-400 mr-2" size={16} />}
              placeholder="Mật khẩu của bạn"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className="mb-4">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-105"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
