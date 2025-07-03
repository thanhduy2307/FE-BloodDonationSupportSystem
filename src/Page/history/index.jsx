import React, { useState, useMemo, useEffect } from 'react';
import {
  Droplets,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter as FilterIcon,
} from 'lucide-react';
import api from '../../configs/axios';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm ghi chú..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            min={todayStr}
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            min={todayStr}
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="pending">Chờ xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </div>
  );
};

const BloodHistoryTable = ({ records, title, onUpdate, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Ngày không hợp lệ' : date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-red-600 mb-3">{title}</h2>
      {records.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
          <p className="text-gray-600">Hãy thử thay đổi bộ lọc hoặc quay lại sau.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhóm máu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cập nhật</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xóa</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Calendar className="inline w-4 h-4 text-gray-400 mr-2" />
                      {formatDate(r.date)}
                    </td>
                    <td className="px-6 py-4">{r.amount} {r.unit}</td>
                    <td className="px-6 py-4 text-red-600">{r.bloodType || 'N/A'}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.notes || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                        onClick={() => onUpdate(r)}
                      >
                        Cập nhật
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === "pending" ? (
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                          onClick={() => onDelete(r)}
                        >
                          Xóa
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic" title="Chỉ được xóa khi ở trạng thái chờ">
                          Không thể xóa
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 mt-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Hiển thị {startItem} đến {endItem} trên tổng {totalItems} bản ghi
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Mỗi trang:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <span className="text-sm">{currentPage}</span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapData = (data, type) =>
  data.map((item, index) => {
    const realId = item.id || item.donationId || item.requestId || index; // 👈 Dòng quan trọng

    return {
      id: `${type}-${realId}`,
      date:
        type === "donation"
          ? (item.donationDate && item.donationTime
              ? `${item.donationDate}T${item.donationTime}`
              : item.donationDate || "")
          : (item.requestDate && item.requestTime
              ? `${item.requestDate}T${item.requestTime}`
              : item.requestDate || ""),
      amount: item.quantity || 0,
      unit: "ml",
      bloodType: item.bloodGroup || "N/A",
      status: item.status || "pending",
      notes: item.notes || "",
      type,
      raw: {
        ...item,
        id: realId, // 👈 Thêm dòng này để đảm bảo raw.id không undefined
      },
    };
  });


const BloodHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requests, donations] = await Promise.all([
          api.get("User/requests"),
          api.get("User/donations"),
          
        ]);
        console.log("✅ donations", donations.data); // 👈 THÊM DÒNG NÀY
    console.log("✅ requests", requests.data);   // 👈 VÀ DÒNG NÀY
        setRecords([
          ...mapData(donations.data, "donation"),
          ...mapData(requests.data, "receive"),
        ]);
      } catch (error) {
        setRecords([]);
      }
    };
    fetchData();
  }, []);

  const filterFn = (r) => {
    const matchesStatus = !filters.status || r.status === filters.status;
    const matchesSearch = !filters.search || (r.notes || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesStart = !filters.startDate || new Date(r.date) >= new Date(filters.startDate);
    const matchesEnd = !filters.endDate || new Date(r.date) <= new Date(filters.endDate);
    return matchesStatus && matchesSearch && matchesStart && matchesEnd;
  };

  const donationRecords = useMemo(() => records.filter(r => r.type === 'donation' && filterFn(r)), [records, filters]);
  const receiveRecords = useMemo(() => records.filter(r => r.type === 'receive' && filterFn(r)), [records, filters]);

  const paginatedDonation = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return donationRecords.slice(start, start + itemsPerPage);
  }, [donationRecords, currentPage, itemsPerPage]);

  const paginatedReceive = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return receiveRecords.slice(start, start + itemsPerPage);
  }, [receiveRecords, currentPage, itemsPerPage]);

  const handleUpdate = (record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = async (updatedData) => {
    try {
      if (selectedRecord.type === "donation") {
        await api.put(`User/updateDonation/${selectedRecord.raw.id}`, {
          id: selectedRecord.raw.id,
          donationDate: updatedData.date,
          bloodGroup: updatedData.bloodType,
          quantity: updatedData.amount,
        });toast.success("Cập nhật hiến máu thành công!");
      } else if (selectedRecord.type === "receive") {
        await api.put(`User/updateRequest/${selectedRecord.raw.id}`, {
          requestId: selectedRecord.raw.id,
          quantity: updatedData.amount,
          requestDate: updatedData.date,
          requestTime: selectedRecord.raw.requestTime || "08:00",
        });toast.success("Cập nhật nhận máu thành công!");
      }

      setRecords((prev) =>
        prev.map((r) =>
          r.id === selectedRecord.id ? { ...r, ...updatedData } : r
        )
      );
      setShowUpdateModal(false);
      setSelectedRecord(null);
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (record) => {
    if (record.status !== "pending") {
      alert("Chỉ có thể xóa các bản ghi đang chờ xử lý.");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa ?")) return;
console.log("💥 Delete donation:", record);
console.log("💥 ID gửi vào:", record.raw.id);
    try {
      if (record.type === "donation") {
        await api.delete(`User/deleteDonation/${record.raw.id}`);
        toast.success("Xóa hiến máu thành công!");
      } else if (record.type === "receive") {
        await api.delete(`User/deleteRequest/${record.raw.id}`);
        toast.success("Xóa nhận máu thành công!");
      }
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lịch sử hiến và nhận máu</h1>
        <FilterPanel filters={filters} onFilterChange={setFilters} />
        <BloodHistoryTable
          records={paginatedDonation}
          title="Lịch sử hiến máu"
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <BloodHistoryTable
          records={paginatedReceive}
          title="Lịch sử nhận máu"
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((donationRecords.length + receiveRecords.length) / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={donationRecords.length + receiveRecords.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Modal cập nhật */}
        {showUpdateModal && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Cập nhật lịch sử</h3>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedData = {
                    date: formData.get('date'),
                    bloodType: formData.get('bloodType'),
                    amount: formData.get('amount'),
                  };
                  handleSaveUpdate(updatedData);
                }}
              >
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Ngày</label>
                  <input
                    name="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    defaultValue={selectedRecord.date ? selectedRecord.date.slice(0, 10) : ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Nhóm máu</label>
                  <select
                    name="bloodType"
                    defaultValue={selectedRecord.bloodType}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Số lượng (ml)</label>
                  <input
                    name="amount"
                    type="number"
                    defaultValue={selectedRecord.amount}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodHistoryPage;
