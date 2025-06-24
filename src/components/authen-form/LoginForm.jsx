import React from "react";
import { Form, Input, Button, Checkbox } from "antd";

<<<<<<< Updated upstream
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Lock } from 'lucide-react';


import { Link } from 'react-router-dom';
import { login } from '../../redux/features/userSlice';
import api from '../../configs/axios';
import axios from 'axios';
=======
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Lock } from "lucide-react";
>>>>>>> Stashed changes

import { Link } from "react-router-dom";
import { login } from "../../redux/features/userSlice";
import api from "../../configs/axios";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

<<<<<<< Updated upstream
  // const onFinish = async (values) => {
  //   try {
  //     const response = await axios.post('https://ae7d-14-226-226-52.ngrok-free.app/api/Auth/login', values);
  //     dispatch(login(response.data));
  //     localStorage.setItem("token", response.data.token);
  //     localStorage.setItem("user", JSON.stringify(response.data.user));
  //     // const user = response.data.data;
  //     // // if (user.role === "ADMIN") {
  //     // //   navigate("/dashboard/overview");
  //     // // } else if (user.role === "USER") {
  //     // //   navigate("/");
  //     // // }else if (user.role === "STAFF") {
  //     // //   navigate("/dashboard-staff/user");
  //     // // }

  //   } catch (e) {
  //     console.log(e);
  //     toast.error(e?.response?.data || "Đã xảy ra lỗi khi đăng nhập");
  //   }
  // };
const onFinish = async (values) => {
  try {
    const response = await axios.post('https://ae7d-14-226-226-52.ngrok-free.app/api/Auth/login', values);

    const { token, user } = response.data || {};

    if (!token || !user) {
      toast.error("Login không thành công: thiếu token hoặc user");
      return;
=======
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "https://ae7d-14-226-226-52.ngrok-free.app/api/Auth/login", values);
      dispatch(login(response.data.data));
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const user = response.data.data;
      if (user.role === "ADMIN") {
        navigate("/dashboard/overview");
      } else if (user.role === "USER") {
        navigate("/");
      } else if (user.role === "STAFF") {
        navigate("/dashboard-staff/user");
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data || "Đã xảy ra lỗi khi đăng nhập");
>>>>>>> Stashed changes
    }

    // Chỉ toast thành công
    toast.success("Đăng nhập thành công!");

    // Lưu lại token và user nếu muốn
    dispatch(login(user));
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Không chuyển trang
  } catch (e) {
    console.log("Login error:", e);
    toast.error(e?.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập");
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
<<<<<<< Updated upstream
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
=======
            label="Tên đăng nhập"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
>>>>>>> Stashed changes
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
