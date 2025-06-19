import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function StaffFeedback() {
  const [datas, setDatas] = useState([]);

  const fetchFeedBack = async () => {
    try {
      const response = await api.get("feedback");
      setDatas(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    fetchFeedBack();
  }, []);

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Created By",
    dataIndex: "createdBy", 
    key: "createdBy",
  },
  {
    title: "Feedback Type",
    dataIndex: "feedbackType",
    key: "feedbackType",
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Report Date",
    dataIndex: "reportDate",
    key: "reportDate",
  },
];

  return (
    <div>
      <Table columns={columns} dataSource={datas} rowKey="id" />
    </div>
  );
}

export default StaffFeedback;
