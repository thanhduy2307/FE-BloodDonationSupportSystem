import React from "react";
import { Form, Input, Select, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";

const { TextArea } = Input;
const { Option } = Select;

const FeedbackForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();

    const handleSubmit = async (values) => {
      const payload = {
        createdBy: user?.id,
        feedbackType: values.feedbackType,
        content: values.content,
        reportDate: new Date().toISOString().split("T")[0],
      };

      try {
        await api.post("Feedback", payload);
        toast.success("Gửi phản hồi thành công!");
        form.resetFields();
        navigate("/feedback");
      } catch (error) {
        console.error(error);
        toast.error("Đã có lỗi xảy ra khi gửi phản hồi.");
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative px-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-blue-600 hover:underline font-medium"
      >
        ← Trang chủ
      </button>

      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Gửi phản hồi
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >


          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung phản hồi" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              Gửi phản hồi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FeedbackForm;
