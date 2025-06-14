import React, { useState } from "react";
import { Input, Select, Button, Form } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios"; // tùy đường dẫn của bạn
import { useSelector } from "react-redux";
import { nav } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const FeedbackForm = () => {
  const user = useSelector((state) => state.user); 
    const navigate = useNavigate(); // sử dụng useNavigate từ react-router-dom
  const [formData, setFormData] = useState({
    feedbackType: "",
    content: "",
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.feedbackType || !formData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return ;
    }
    
    const payload = {
      createdBy: user.name,
      feedbackType: formData.feedbackType,
      content: formData.content,
      reportDate: new Date().toISOString().split("T")[0], 
    };

    try {
      await api.post("feedback", payload);
      toast.success("Gửi phản hồi thành công!");
      navigate("/"); 
      setFormData({ feedbackType: "", content: "" });
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi gửi phản hồi.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Gửi phản hồi</h2>
      <Form layout="vertical">
        <Form.Item label="Loại phản hồi">
          <Select
            placeholder="Chọn loại phản hồi"
            value={formData.feedbackType}
            onChange={(value) => handleChange("feedbackType", value)}
          >
            <Select.Option value="Góp ý">Góp ý</Select.Option>
            <Select.Option value="Báo lỗi">Báo lỗi</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nội dung">
          <TextArea
            rows={4}
            placeholder="Nhập nội dung phản hồi"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="bg-red-600 hover:bg-red-700"
            block
            onClick={handleSubmit}
          >
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FeedbackForm;
