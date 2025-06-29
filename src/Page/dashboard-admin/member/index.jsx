import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function ManageUser() {
  const [datas, setDatas] = useState([]);

  const convertRoleIdToName = (roleValue) => {
    if (typeof roleValue === "string") return roleValue;
    switch (roleValue) {
      case 1:
        return "User";
      case 2:
        return "Staff";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("Admin/users");
      const mapped = response.data.map((user) => ({
        ...user,
        role: convertRoleIdToName(user.role ?? user.roleName),
      }));
      console.log("Fetched users:", mapped);
      setDatas(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`Admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUser();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const roleMap = {
  User: 1,
  Staff: 2,
  Admin: 3,
};

const handleChangeRole = async (userId, newRole) => {
  try {
    const roleId = roleMap[newRole];
    await api.put(`Admin/users/${userId}/role`, roleId, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success("Role updated successfully");
    fetchUser();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update role");
  }
};

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
       sorter: (a, b) => a.userId - b.userId,
  defaultSortOrder: "ascend"
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Role",
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
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record.userId)}
          style={{
            color: "red",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
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
