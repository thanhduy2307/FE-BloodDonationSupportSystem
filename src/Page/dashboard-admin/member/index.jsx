import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import { Select } from "antd";
function ManageUser() {
  const [datas, setDatas] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await api.get("profiles");
      setDatas(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch profiles");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`profiles/${id}`);
      toast.success("User deleted successfully");
      fetchUser(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };
  const handleChangeRole = async (id, newRole) => {
  try {
    await api.put(`profiles/${id}/role`, { role: newRole });
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
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "Fullname",
      key: "Fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => (
    <Select
      value={record.role}
      onChange={(value) => handleChangeRole(record.id, value)}
      style={{ width: 120 }}
    >
      <Select.Option value="user">User</Select.Option>
      <Select.Option value="staff">Staff</Select.Option>
      <Select.Option value="admin">Admin</Select.Option>
    </Select>
  ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record.id)}
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
      <Table columns={columns} dataSource={datas} rowKey="id" />
    </div>
  );
}
export default ManageUser;
