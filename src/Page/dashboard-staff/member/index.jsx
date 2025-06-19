import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function StaffMember() {
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
  ];

  return (
    <div>
      <Table columns={columns} dataSource={datas} rowKey="id" />
    </div>
  );
}
export default StaffMember;
