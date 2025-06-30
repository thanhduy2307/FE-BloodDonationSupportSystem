import { Table, Input, Button, Space, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import dayjs from "dayjs";

function StaffFeedback() {
  const [datas, setDatas] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchFeedBack = async () => {
    try {
      const response = await api.get("Feedback");
      setDatas(response.data);
      setFilteredData(response.data); // init filtered data
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    fetchFeedBack();
  }, []);

  const handleSearch = () => {
    const filtered = datas.filter((item) =>
      item.feedbackType.toLowerCase().includes(searchType.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`feedback/${id}`);
      toast.success("Deleted successfully");
      setDatas((prev) => prev.filter((item) => item.id !== id));
      setFilteredData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete feedback");
    }
  };

const columns = [
  {
    title: "ID",
    dataIndex: "feedbackId",
    key: "feedbackId",
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Feedback Date",
    dataIndex: "feedbackDate",
    key: "feedbackDate",
    render: (date) => dayjs(date).format("DD/MM/YYYY"),
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, record) => (
  //     <Popconfirm
  //       title={`Are you sure to delete feedback ${record.feedbackId}?`}
  //       onConfirm={() => handleDelete(record.feedbackId)}
  //       okText="Yes"
  //       cancelText="No"
  //     >
  //       <Button danger type="link">Delete</Button>
  //     </Popconfirm>
  //   ),
  // },
];


  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by feedback type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="id" />
    </div>
  );
}

export default StaffFeedback;
