import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import api from "../../configs/axios";

const { Option } = Select;

const ApprovedDonorsDashboard = () => {
  // States
  const [data, setData] = useState([
    {
      donationId: 1,
      userId: "USER001",
      fullname: "Nguyễn Văn An",
      dateOfBirth: "1995-05-15",
      phoneNumber: "0901234567",
      address: "123 Lê Lợi, Q.1, TP.HCM",
      donationDate: "2023-08-01",
      bloodGroup: "",
      quantity: 0,
      status: "approved",
    },
    // ... copy các data mẫu khác từ code cũ
  ]);

  const [loading, setLoading] = useState(false);
  const [basicFormVisible, setBasicFormVisible] = useState(false);
  const [screeningFormVisible, setScreeningFormVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Forms
  const [basicForm] = Form.useForm();
  const [screeningForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  // Handlers
  const handleOpenBasicForm = (record) => {
    setSelectedRecord(record);
    setBasicFormVisible(true);
    basicForm.setFieldsValue({
      bloodGroup: record.bloodGroup || undefined,
      quantity: record.quantity || 350,
      notes: record.notes || "",
    });
  };

  const handleSaveBasicInfo = async () => {
    try {
      const values = await basicForm.validateFields();
      const updatedRecord = {
        ...selectedRecord,
        ...values,
      };
      
      // Gọi API cập nhật thông tin cơ bản
      await api.post(`/Doctor/update-basic/${selectedRecord.donationId}`, values);
      
      // Cập nhật state local
      const newData = data.map(item => 
        item.donationId === selectedRecord.donationId 
          ? updatedRecord 
          : item
      );
      setData(newData);
      
      message.success("Đã lưu thông tin cơ bản");
      setBasicFormVisible(false);
    } catch (error) {
      message.error("Lưu thất bại");
    }
  };

  const handleStatusChange = (value, record) => {
    if (value === "rejected") {
      setSelectedRecord(record);
      setRejectModalVisible(true);
    } else if (value === "completed") {
      if (!record.bloodGroup || !record.quantity) {
        message.error("Vui lòng nhập thông tin cơ bản trước");
        return;
      }
      setSelectedRecord(record);
      setScreeningFormVisible(true);
      screeningForm.resetFields();
    } else {
      updateStatus(record.donationId, value);
    }
  };

  const handleSaveScreening = async () => {
    try {
      const values = await screeningForm.validateFields();
      
      // Gọi API lưu kết quả sàng lọc
      await api.post(`/Doctor/medical-screening/${selectedRecord.donationId}`, values);
      
      message.success("Đã lưu kết quả sàng lọc");
      setScreeningFormVisible(false);
      
      // Cập nhật trạng thái thành completed
      updateStatus(selectedRecord.donationId, "completed");
    } catch (error) {
      message.error("Lưu thất bại");
    }
  };

  const handleReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      updateStatus(selectedRecord.donationId, "rejected", values.reason);
      setRejectModalVisible(false);
      rejectForm.resetFields();
    } catch (error) {
      message.error("Vui lòng nhập lý do từ chối");
    }
  };

  const handleImportStock = async () => {
    try {
      const stockData = {
        bloodType: selectedRecord.bloodGroup,
        quantity: selectedRecord.quantity,
        donationDate: selectedRecord.donationDate,
        donorId: selectedRecord.userId,
      };

      await api.post("/BloodStock/import", stockData);
      
      const newData = data.map(item => {
        if (item.donationId === selectedRecord.donationId) {
          return { ...item, isImported: true };
        }
        return item;
      });
      setData(newData);
      
      message.success("Nhập kho thành công");
      setImportModalVisible(false);
    } catch (error) {
      message.error("Nhập kho thất bại");
    }
  };

  const updateStatus = (id, status, reason = "") => {
    const newData = data.map(item => {
      if (item.donationId === id) {
        return { 
          ...item, 
          status,
          ...(reason && { rejectReason: reason })
        };
      }
      return item;
    });
    setData(newData);
    message.success("Đã cập nhật trạng thái");
  };

  // Column Definitions
  const columns = [
    { title: "Họ tên", dataIndex: "fullname" },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      render: (dob) => dob ? new Date(dob).toLocaleDateString("vi-VN") : "Không có",
    },
    { title: "SĐT", dataIndex: "phoneNumber" },
    { title: "Địa chỉ", dataIndex: "address" },
    {
      title: "Ngày đăng ký",
      dataIndex: "donationDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodGroup",
      render: (text) => !text ? <i style={{ color: "gray" }}>Chưa xác định</i> : text,
    },
    {
      title: "Số lượng (ml)",
      dataIndex: "quantity",
      render: (value) => value || "-",
    },
    {
      title: "Tiếp nhận",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleOpenBasicForm(record)}
          disabled={record.status === "absent"}
        >
          {record.bloodGroup ? "Cập nhật" : "Tiếp nhận"}
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Select
            value={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(value, record)}
            placeholder="Chọn trạng thái"
          >
            <Option value="completed">Hoàn thành</Option>
            <Option value="absent">Vắng mặt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
          {record.status === "completed" && !record.isImported && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRecord(record);
                setImportModalVisible(true);
              }}
              size="small"
            >
              Nhập kho
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Danh sách hiến máu đã duyệt</h2>

      <Table
        rowKey="donationId"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
      />

      {/* Modal nhập thông tin cơ bản */}
      <Modal
        title="Tiếp nhận hiến máu"
        open={basicFormVisible}
        onCancel={() => setBasicFormVisible(false)}
        onOk={handleSaveBasicInfo}
        okText="Lưu thông tin"
      >
        <Form form={basicForm} layout="vertical">
          <Form.Item
            name="bloodGroup"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select placeholder="Chọn nhóm máu">
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

          <Form.Item
            name="quantity"
            label="Số lượng máu hiến (ml)"
            rules={[{ required: true, message: "Vui lòng nhập số lượng máu" }]}
          >
            <Input type="number" min={0} max={500} />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal khám sàng lọc */}
      <Modal
        title="Khám sàng lọc trước hiến máu"
        open={screeningFormVisible}
        onCancel={() => setScreeningFormVisible(false)}
        onOk={handleSaveScreening}
        okText="Lưu sàng lọc"
        width={700}
      >
        <Form form={screeningForm} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Form.Item
                name="hasChronicDisease"
                label="Có bệnh mãn tính"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hasRecentMedication"
                label="Đang dùng thuốc gần đây"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hivTestResult"
                label="HIV dương tính"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="bloodPressure"
                label="Huyết áp"
                rules={[{ required: true, message: "Vui lòng nhập huyết áp" }]}
              >
                <Input placeholder="VD: 120/80" />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="hepatitisB"
                label="Viêm gan B"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hepatitisC"
                label="Viêm gan C"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="syphilis"
                label="Giang mai"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
              >
                <Select placeholder="Chọn">
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hemoglobinLevel"
                label="Nồng độ Hemoglobin (g/dL)"
                rules={[{ required: true, message: "Không được bỏ trống" }]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal từ chối */}
      <Modal
        title="Lý do từ chối"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
        }}
      >
        <Form form={rejectForm}>
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal nhập kho */}
      <Modal
        title="Xác nhận nhập kho máu"
        open={importModalVisible}
        onOk={handleImportStock}
        onCancel={() => setImportModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div>
          <h3 className="font-semibold mb-2">Thông tin nhập kho</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><strong>Người hiến:</strong> {selectedRecord?.fullname}</li>
            <li><strong>Nhóm máu:</strong> {selectedRecord?.bloodGroup}</li>
            <li><strong>Số lượng:</strong> {selectedRecord?.quantity} ml</li>
            <li><strong>Ngày hiến:</strong> {selectedRecord?.donationDate && 
              new Date(selectedRecord.donationDate).toLocaleDateString("vi-VN")}</li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ApprovedDonorsDashboard;