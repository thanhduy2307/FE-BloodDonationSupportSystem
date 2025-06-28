import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function StaffMember() {
  const [datas, setDatas] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await api.get("User/profile");
      console.log("📦 response.data:", response.data);
      setDatas([response.data]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch profiles");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "Fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={datas} rowKey="id" />
    </div>
  );
}
export default StaffMember;
