import React from "react";
import { Button, Form, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Droplet } from "lucide-react";
import api from "../../configs/axios";
import "./register.css";
import {   Select } from "antd";
const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
    };

    try {
      await api.post("Auth/register", formattedValues);
      toast.success("Tạo tài khoản thành công!");
      navigate("/login");
    } catch (e) {
      const errorData = e.response?.data;
      if (errorData?.errors) {
        const fieldErrors = Object.entries(errorData.errors).map(
          ([field, messages]) => ({
            name: field.charAt(0).toLowerCase() + field.slice(1),
            errors: messages,
          })
        );
        form.setFields(fieldErrors);
        Object.values(errorData.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else if (errorData?.error) {
        form.setFields([
          {
            name: "email",
            errors: [errorData.error],
          },
        ]);
        toast.error(errorData.error);
      } else {
        toast.error("Đăng ký thất bại!");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("❌ Validate failed:", errorInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Droplet className="text-red-600 mr-2" size={32} />
            <span className="text-2xl font-bold text-red-600">HeartDrop</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký tài khoản
          </h2>
          <p className="text-gray-600">
            Tham gia cộng đồng hiến máu nhân đạo ngay hôm nay
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          name="register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select
              placeholder="Chọn giới tính"
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
                { value: "Khác", label: "Khác" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[
              { required: true, message: "Vui lòng chọn ngày sinh!" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const today = new Date();
                  const birthDate = value.toDate();
                  const age =
                    today.getFullYear() -
                    birthDate.getFullYear() -
                    (today.getMonth() < birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() &&
                      today.getDate() < birthDate.getDate())
                      ? 1
                      : 0);
                  return age >= 18
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Bạn phải đủ 18 tuổi để được hiến máu.")
                      );
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Chọn ngày sinh"
              disabledDate={(current) => current && current > new Date()}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-red-600 hover:bg-red-700 border-none rounded-full text-white"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Đăng nhập
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
