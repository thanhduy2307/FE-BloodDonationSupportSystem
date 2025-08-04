import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const { Option } = Select;

const ApprovedDonorsDashboard = () => {
  // States
  const [data, setData] = useState([
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
  useEffect(() => {
    
    const fetchPendingDonations = async () => {
      setLoading(true);

      try {
        const res = await api.get("/Doctor/pending-donations");
        const transformed = res.data.map((item) => ({
          ...item,
          id: item.id || item.donationId, // ưu tiên item.id, fallback sang donationId
        }));
        setData(transformed);
      } catch (error) {
        message.error("Không thể tải danh sách hiến máu");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDonations();
  }, []);

  const handleSaveBasicInfo = async () => {
    try {
      const values = await basicForm.validateFields();
      const updatedRecord = {
        ...selectedRecord,
        ...values,
      };

      // Gọi API cập nhật thông tin cơ bản khác
      await api.post(`Doctor/pre-screening/${selectedRecord.id}`, values);

      // Cập nhật state local
      const newData = data.map((item) =>
        item.id === selectedRecord.id ? updatedRecord : item
      );
      setData(newData);

      toast.success("Đã lưu thông tin cơ bản");
      setBasicFormVisible(false);
    } catch (error) {
      message.error("Lưu thất bại");
    }
  };

  const handleStatusChange = (value, record) => {
    if (value === "rejected" || value === "Not eligible") {
      // Thêm điều kiện Not eligible
      setSelectedRecord(record);
      setRejectModalVisible(true);
    } else {
      updateStatus(record.donationId, value);
    }
  };

  const handleSaveScreening = async () => {
    try {
      const values = await screeningForm.validateFields();

      // Gọi API lưu kết quả sàng lọc
      await api.post(`Doctor/post-analysis/${selectedRecord.id}`, values);

      toast.success("Đã lưu kết quả xét nghiệm ");
      setScreeningFormVisible(false);

      // Cập nhật trạng thái thành completed
    } catch (error) {
      message.error("Lưu thất bại");
    }
  };

  const handleReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      const status =
        selectedRecord?.status === "Not eligible" ? "Not eligible" : "rejected";
      updateStatus(selectedRecord.donationId, status, values.reason);
      setRejectModalVisible(false);
      rejectForm.resetFields();
    } catch (error) {
      message.error("Vui lòng nhập lý do");
    }
  };

  const handleImportStock = async () => {
    try {
      // Gọi trực tiếp API nhập kho
      await api.post(`/Doctor/donations/${selectedRecord.donationId}/stock`);

      const newData = data.map((item) => {
        if (item.donationId === selectedRecord.donationId) {
          return { ...item, isImported: true };
        }
        return item;
      });
      setData(newData);

      toast.success("Nhập kho thành công");
      setImportModalVisible(false);
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      message.error("Không thể nhập kho máu");
    }
  };

  const updateStatus = async (donationId, newStatus, reason = "") => {
    

    console.log("✅ ID gửi đi:", donationId);

    try {
      await api.put(`Admin/donations/${donationId}/status`, {
        donationId,
        status: newStatus,
        ...(reason ? { reason } : {}),
      });

      setData((prevData) =>
        prevData.map((item) =>
          item.id === donationId
            ? {
                ...item,
                status: newStatus,
                ...(reason ? { rejectReason: reason } : {}),
              }
            : item
        )
      );

      toast.success("Đã cập nhật trạng thái thành công");
    } catch (err) {
      console.error("🚨 Lỗi khi cập nhật trạng thái:", err);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Column Definitions
  const columns = [
    { title: "Họ tên", dataIndex: "fullname" },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      render: (dob) =>
        dob ? new Date(dob).toLocaleDateString("vi-VN") : "Không có",
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
      dataIndex: "bloodGroup", // dữ liệu từ API trả về
      render: (text, record) => {
        if (!text) {
          return (
            <Select
              placeholder="Chọn nhóm máu"
              style={{ width: 120 }}
              onChange={async (value) => {
                console.log("🩸 Cập nhật bloodGroup cho userId:", record.userId); // 👈 thêm dòng này
                try {
                  await api.put(
                    `/Doctor/update-blood-group/${record.userId}`,
                    { BloodType: value } // key đúng như backend yêu cầu
                  );
                  toast.success("Cập nhật nhóm máu thành công");

                  // cập nhật lại data local với key đúng là bloodGroup
                  const newData = data.map((item) =>
                    item.id === record.userId
                      ? { ...item, bloodGroup: value }
                      : item
                  );
                  setData(newData);
                } catch (error) {
                  console.error(error);
                  message.error("Cập nhật nhóm máu thất bại");
                }
              }}
            >
              <Select.Option value="A+">A+</Select.Option>
              <Select.Option value="A-">A-</Select.Option>
              <Select.Option value="B+">B+</Select.Option>
              <Select.Option value="B-">B-</Select.Option>
              <Select.Option value="O+">O+</Select.Option>
              <Select.Option value="O-">O-</Select.Option>
              <Select.Option value="AB+">AB+</Select.Option>
              <Select.Option value="AB-">AB-</Select.Option>
            </Select>
          );
        } else {
          return text;
        }
      },
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
            <Option value="pending">Chờ kết quả</Option>
            <Option value="Not eligible">Đã hiến-Không đủ điều kiện</Option>
          </Select>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  if (!record.bloodGroup || !record.quantity) {
                    message.error("Vui lòng nhập thông tin cơ bản trước");
                    return;
                  }
                  setSelectedRecord(record);
                  setScreeningFormVisible(true);
                }}
                size="small"
              >
                Phiếu xét nghiệm máu
              </Button>
              {!record.isImported && (
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
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Danh sách hiến máu đã duyệt
      </h2>

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
          {/* Nhóm máu giữ nguyên */}
          <Form.Item
            label="Nhóm máu"
            name="bloodGroup"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select
              placeholder="Chọn nhóm máu"
              disabled={
                selectedRecord?.bloodGroup &&
                selectedRecord.bloodGroup !== "Chưa biết"
              }
              onChange={async (value) => {
                try {
                  // Gọi API ngay khi chọn
                  await api.put(
                    `/Doctor/update-blood-group/${selectedRecord.userId}`,
                    {
                      BloodType: value,
                    }
                  );
                  toast.success("Cập nhật nhóm máu thành công");
                } catch (error) {
                  message.error("Cập nhật nhóm máu thất bại");
                }
              }}
            >
              <Select.Option value="A+">A+</Select.Option>
              <Select.Option value="A-">A-</Select.Option>
              <Select.Option value="B+">B+</Select.Option>
              <Select.Option value="B-">B-</Select.Option>
              <Select.Option value="O+">O+</Select.Option>
              <Select.Option value="O-">O-</Select.Option>
              <Select.Option value="AB+">AB+</Select.Option>
              <Select.Option value="AB-">AB-</Select.Option>
            </Select>
          </Form.Item>

          {/* Huyết áp */}
          <Form.Item
            name="bloodPressure"
            label="Huyết áp"
            rules={[{ required: true, message: "Vui lòng nhập huyết áp" }]}
          >
            <Input placeholder="Ví dụ: 120/80 mmHg" />
          </Form.Item>

          {/* Nhiệt độ */}
          <Form.Item
            name="temperatureC"
            label="Nhiệt độ cơ thể (°C)"
            rules={[{ required: true, message: "Vui lòng nhập nhiệt độ" }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>

          {/* Nhịp tim */}
          <Form.Item
            name="heartRateBpm"
            label="Nhịp tim (bpm)"
            rules={[{ required: true, message: "Vui lòng nhập nhịp tim" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          {/* Tiền sử bệnh lý */}
          <Form.Item name="medicalHistory" label="Tiền sử bệnh lý">
            <Input.TextArea
              rows={3}
              placeholder="Nhập thông tin tiền sử bệnh lý nếu có"
            />
          </Form.Item>

          {/* Trạng thái sức khỏe */}
          <Form.Item
            name="currentHealthStatus"
            label="Trạng thái sức khỏe hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập trạng thái sức khỏe" },
            ]}
          >
            <Input.TextArea rows={2} />
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
            </div>

            <div>
              <Form.Item
                name="bloodPressure"
                label="Huyết áp"
                rules={[{ required: true, message: "Vui lòng nhập huyết áp" }]}
              >
                <Input placeholder="VD: 120/80" />
              </Form.Item>

              <Form.Item
                name="hemoglobinLevel"
                label="Nồng độ Hemoglobin (g/dL)"
                rules={[{ required: true, message: "Không được bỏ trống" }]}
              >
                <Input type="number" min={0} />
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
            </div>
          </div>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal từ chối */}
      {/* Modal từ chối/không đủ điều kiện */}
      <Modal
        title={`${
          selectedRecord?.status === "Not eligible"
            ? "Lý do không đủ điều kiện"
            : "Lý do từ chối"
        }`}
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
            label={
              selectedRecord?.status === "Not eligible"
                ? "Lý do không đủ điều kiện"
                : "Lý do từ chối"
            }
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
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
            <li>
              <strong>Người hiến:</strong> {selectedRecord?.fullname}
            </li>
            <li>
              <strong>Nhóm máu:</strong> {selectedRecord?.bloodGroup}
            </li>
            <li>
              <strong>Số lượng:</strong> {selectedRecord?.quantity} ml
            </li>
            <li>
              <strong>Ngày hiến:</strong>{" "}
              {selectedRecord?.donationDate &&
                new Date(selectedRecord.donationDate).toLocaleDateString(
                  "vi-VN"
                )}
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ApprovedDonorsDashboard;
