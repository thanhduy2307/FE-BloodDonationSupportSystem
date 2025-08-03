import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function ManageUser() {
  const [datas, setDatas] = useState([]);

  const roleMap = {
    User: 1,
    Staff: 2,
    Admin: 3,
    Doctor: 4,
  };

  const convertRoleIdToName = (role) => {
    if (typeof role === "string") return role;
    switch (role) {
      case 1: return "User";
      case 2: return "Staff";
      case 3: return "Admin";
       case 4: return "Doctor";
      default: return "Unknown";
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return "Active";
    const s = status.toLowerCase();
    if (s.includes("active")) return "active";
    return "disabled";
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("Admin/users");
      const mapped = response.data.map((user) => ({
        ...user,
        role: convertRoleIdToName(user.role ?? user.roleName),
        statusRaw: user.status, // Lưu lại status gốc
        status: normalizeStatus(user.status),
      }));
      setDatas(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChangeRole = async (userId, newRoleName) => {
    try {
      const roleId = roleMap[newRoleName];
      await api.put(`Admin/users/${userId}/role`, roleId, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Cập nhật vai trò thành công");
      fetchUser();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật vai trò thất bại");
    }
  };

  const handleChangeStatus = async (userId, value) => {
    try {
      const statusValue = value === "active" ? 1 : 2;
      await api.put(`Admin/users/${userId}/status`, statusValue, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Cập nhật trạng thái thành công");
      fetchUser();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
      defaultSortOrder: "ascend",
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_, record) => (
        <Select
          value={record.role}
          onChange={(value) => handleChangeRole(record.userId, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="User">User</Select.Option>
          <Select.Option value="Staff">Staff</Select.Option>
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="Doctor">Doctor</Select.Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleChangeStatus(record.userId, value)}
          style={{ width: 140 }}
        >
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="disabled">Disabled</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={datas}
        rowKey="userId"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default ManageUser;
