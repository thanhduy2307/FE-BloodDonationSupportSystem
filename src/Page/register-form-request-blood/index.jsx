import React from "react";
import { Form, InputNumber, Select, Button, DatePicker } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";

const { Option } = Select;

const BloodDonationForm = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const data = {
        userId: user?.id,
        bloodType: values.BloodType,
        quantity: values.quantity,
        donationDate: values.donationDate.format("YYYY-MM-DD"),
        status: "Pending",
      };

      await api.post("User/donate", data);
      toast.success("Đăng ký hiến máu thành công!");
      form.resetFields();
    } catch (error) {
      toast.error("Lỗi khi gửi đăng ký!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 px-4 pt-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-white text-red-600 font-semibold px-4 py-2 rounded shadow hover:bg-red-100 transition"
        >
          ← Về trang chủ
        </button>

        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Đăng ký hiến máu
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Form.Item
            name="BloodType"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select placeholder="Chọn nhóm máu">
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng (đơn vị) "
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="donationDate"
            label="Ngày hiến máu"
            className="md:col-span-2"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item className="md:col-span-2">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Gửi đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default BloodDonationForm;
