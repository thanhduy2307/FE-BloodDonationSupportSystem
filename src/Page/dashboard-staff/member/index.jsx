import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function StaffMember() {
  const [datas, setDatas] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await api.get("Admin/users");
      console.log("📦 response.data:", response.data);
      setDatas(response.data);
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
      title: "ID",
      dataIndex: "userId",
      key: "userId",
    },
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
