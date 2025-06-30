import React from "react";
import { Form, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const CreateBloodEvent = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const formData = {
      title: values.title,
      description: values.description || "",
      eventDate: dayjs(values.eventDate).format("YYYY-MM-DD"),
    };

    onSubmit && onSubmit(formData);
    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      className="mt-2"
    >
      <Form.Item
        name="title"
        label="Chủ đề sự kiện"
        rules={[{ required: true, message: "Vui lòng nhập chủ đề" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="eventDate"
        label="Ngày tổ chức"
        rules={[{ required: true, message: "Vui lòng chọn ngày tổ chức" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Tạo sự kiện
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateBloodEvent;
