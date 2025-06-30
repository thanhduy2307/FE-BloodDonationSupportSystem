import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import dayjs from "dayjs";

function ManageFeedback() {
  const [datas, setDatas] = useState([]);

  const fetchFeedBack = async () => {
    try {
      const response = await api.get("Feedback");
      console.log("Feedback data:", response.data.data);
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
    dataIndex: "feedbackId",
    key: "feedbackId",
  },
  {
    title: "Người gửi",
    dataIndex: "createdByName",
    key: "createdByName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Ngày góp ý",
    dataIndex: "feedbackDate",
    key: "feedbackDate",
    render: (date) => dayjs(date).format("DD/MM/YYYY"),
  },
];


  return (
    <div>
      <Table columns={columns} dataSource={datas} rowKey="id" />
    </div>
  );
}

export default ManageFeedback;
