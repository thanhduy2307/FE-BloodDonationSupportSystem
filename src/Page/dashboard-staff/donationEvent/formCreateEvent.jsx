import React from "react";
import { Form, Input, DatePicker, TimePicker, Button, message } from "antd";
import dayjs from "dayjs";

const CreateBloodEvent = () => {
   const handleCreate = async (formData) => {
    try {
      const response = await api.post("event", formData);
      toast.success("Event created successfully");
      setEvents((prev) => [...prev, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      className="mt-2"
    >
      <Form.Item
        name="name"
        label="Tên sự kiện"
        rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="location"
        label="Địa điểm"
        rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="date"
        label="Ngày tổ chức"
        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="time"
        label="Giờ"
        rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
      >
        <TimePicker format="HH:mm" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
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
