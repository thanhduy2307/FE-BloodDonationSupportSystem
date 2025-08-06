import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Droplets,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter as FilterIcon,
  X as CloseIcon,
} from "lucide-react";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Component hiển thị trạng thái
const StatusBadge = ({ status }) => {
  const statusClasses = {
    waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    absent: "bg-red-100 text-red-800 border-red-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    pending_result: "bg-blue-100 text-blue-800 border-blue-200",
    donated_failed: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const translateStatus = (status) => {
    switch (status) {
      case "waiting":
        return "Đang chờ";
      case "completed":
        return "Hoàn thành";
      case "absent":
        return "Vắng mặt";
      case "rejected":
        return "Từ chối";
      case "pending_result":
        return "Chờ kết quả";
      case "donated_failed":
        return "Đã hiến-Không đạt";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {translateStatus(status)}
    </span>
  );
};

// Component bộ lọc
const FilterPanel = ({ filters, onFilterChange }) => {
  const handleFilterChange = useCallback(
    (key, value) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange]
  );

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
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="waiting">Đang chờ</option>
          <option value="completed">Hoàn thành</option>
          <option value="absent">Vắng mặt</option>
          <option value="rejected">Từ chối</option>
          <option value="pending_result">Chờ kết quả</option>
          <option value="donated_failed">Đã hiến-Không đạt</option>
        </select>
      </div>
    </div>
  );
};

// Component bảng lịch sử
const BloodHistoryTable = ({
  records,
  title,
  onViewNote,
  onViewDetail,
  onDelete,
}) => {
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Ngày không hợp lệ" : date.toLocaleDateString("vi-VN");
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-red-600 mb-3">{title}</h2>
      {records.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có dữ liệu
          </h3>
          <p className="text-gray-600">
            Hãy thử thay đổi bộ lọc hoặc quay lại sau.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nhóm máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Calendar className="inline w-4 h-4 text-gray-400 mr-2" />
                      {formatDate(r.date)}
                    </td>
                    <td className="px-6 py-4">
                      {r.amount} {r.unit}
                    </td>
                    <td className="px-6 py-4 text-red-600">
                      {r.bloodType || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => onViewNote(r.raw.id)}
                        >
                          Ghi chú
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => onViewDetail(r.raw.id)}
                        >
                          Chi tiết
                        </button>
                        {r.status === "waiting" && (
                          <button
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            onClick={() => onDelete(r)}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
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

// Component phân trang
const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 mt-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Hiển thị {startItem} đến {endItem} trên tổng {totalItems} bản ghi
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Mỗi trang:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <span className="text-sm font-medium px-2">{currentPage}</span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hàm chuyển đổi dữ liệu
// Hàm chuyển đổi dữ liệu
const mapData = (data, type) =>
  data.map((item, index) => {
    const realId = item.id || item.donationId || item.requestId || index;
    let mappedStatus = item.status || "waiting";

    // Map lại status từ API để phù hợp với UI
    switch (mappedStatus.toLowerCase()) {
      case "pending":
        mappedStatus = "pending_result";
        break;
      // Thêm các mapping khác nếu cần
      default:
        break;
    }

    return {
      id: `${type}-${realId}`,
      date:
        type === "donation"
          ? item.donationDate && item.donationTime
            ? `${item.donationDate}T${item.donationTime}`
            : item.donationDate || ""
          : item.requestDate && item.requestTime
          ? `${item.requestDate}T${item.requestTime}`
          : item.requestDate || "",
      amount: item.quantity || 0,
      unit: "ml",
      bloodType: item.bloodGroup,
      status: mappedStatus,
      notes: item.notes || "",
      type,
      raw: {
        ...item,
        id: realId,
      },
    };
  });

// Component chính
const BloodHistoryPage = () => {
  // States
  const [noteModal, setNoteModal] = useState({ open: false, content: "" });
  const [detailModal, setDetailModal] = useState({ open: false, record: null });
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const donations = await api.get("User/donations");
        setRecords(mapData(donations.data, "donation"));
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setRecords([]);
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleViewNote = useCallback(async (donationId) => {
    try {
      const res = await api.get(`User/doctor-note/${donationId}`);
      const note =
        Array.isArray(res.data) && res.data.length > 0
          ? res.data[0].notes
          : "Không có ghi chú.";
      setNoteModal({ open: true, content: note });
    } catch (err) {
      console.error("Error fetching note:", err);
      toast.error("Không thể lấy ghi chú.");
    }
  }, []);

  const handleViewDetail = useCallback(async (donationId) => {
    try {
      const response = await api.get(`User/getDonate/${donationId}`);
      setDetailModal({
        open: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Error fetching donation details:", error);
      toast.error("Không thể tải thông tin chi tiết!");
    }
  }, []);

  const handleDelete = useCallback(async (record) => {
    if (record.status !== "waiting") {
      toast.error("Chỉ có thể hủy các đăng ký đang chờ duyệt.");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn hủy đăng ký này?")) return;

    try {
      await api.delete(`User/deleteDonation/${record.raw.id}`);
      toast.success("Hủy đăng ký thành công!");
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Hủy đăng ký thất bại. Vui lòng thử lại sau.");
    }
  }, []);

  // Filters
  const filterFn = useCallback(
    (r) => {
      const matchesStatus = !filters.status || r.status === filters.status;
      const matchesSearch =
        !filters.search ||
        (r.notes || "").toLowerCase().includes(filters.search.toLowerCase());
      const matchesStart =
        !filters.startDate || new Date(r.date) >= new Date(filters.startDate);
      const matchesEnd =
        !filters.endDate || new Date(r.date) <= new Date(filters.endDate);
      return matchesStatus && matchesSearch && matchesStart && matchesEnd;
    },
    [filters]
  );

  const filteredRecords = useMemo(
    () => records.filter(filterFn),
    [records, filterFn]
  );

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);
  const TestResult = ({ value, label }) => {
    if (value === null || value === undefined) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Chưa có kết quả
        </span>
      );
    }

    const isPositive =
      value === true || value === "Positive" || value === "positive";
    const colorClass = isPositive
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {isPositive ? "Dương tính" : "Âm tính"}
      </span>
    );
  };

  // Render
  return (
    <>
      {/* Modal Ghi chú */}
      {noteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ghi chú chi tiết</h3>
              <button
                onClick={() => setNoteModal({ open: false, content: "" })}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {noteModal.content}
            </p>
          </div>
        </div>
      )}

      {/* Modal Chi tiết */}
      {detailModal.open && detailModal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thông tin chi tiết</h3>
              <button
                onClick={() => setDetailModal({ open: false, data: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Ngày hiến:</span>{" "}
                  {new Date(detailModal.data.donationDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Thời gian:</span>{" "}
                  {detailModal.data.donationTime}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Số lượng:</span>{" "}
                  {detailModal.data.quantity} ml
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Nhóm máu:</span>{" "}
                  {detailModal.data.bloodGroup}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Chiều cao:</span>{" "}
                  {detailModal.data.height} cm
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Cân nặng:</span>{" "}
                  {detailModal.data.weight} kg
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Huyết áp:</span>{" "}
                  {detailModal.data.bloodPressure || "Chưa đo"}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Nhiệt độ:</span>{" "}
                  {detailModal.data.temperatureC
                    ? `${detailModal.data.temperatureC}°C`
                    : "Chưa đo"}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Nhịp tim:</span>{" "}
                  {detailModal.data.heartRateBpm
                    ? `${detailModal.data.heartRateBpm} BPM`
                    : "Chưa đo"}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Tình trạng sức khỏe:</span>{" "}
                  {detailModal.data.currentHealthStatus || "Không có ghi chú"}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Tiền sử bệnh:</span>{" "}
                  {detailModal.data.medicalHistory || "Không có"}
                </p>
              </div>
            </div>
{/* Kết quả xét nghiệm */}
<div className="mt-4 border-t pt-4">
  <h4 className="font-semibold mb-3">Kết quả xét nghiệm:</h4>
  <div className="grid grid-cols-2 gap-4">
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="mb-2">
        <span className="font-semibold">HIV:</span>{" "}
        <TestResult value={detailModal.data.hivTestResult} />
      </p>
      <p className="mb-2">
        <span className="font-semibold">Viêm gan B:</span>{" "}
        <TestResult value={detailModal.data.hepatitisB} />
      </p>
      <p className="mb-2">
        <span className="font-semibold">Viêm gan C:</span>{" "}
        <TestResult value={detailModal.data.hepatitisC} />
      </p>
      <p className="mb-2">
        <span className="font-semibold">Giang mai:</span>{" "}
        <TestResult value={detailModal.data.syphilis} />
      </p>
    </div>
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="mb-2">
        <span className="font-semibold">Hemoglobin:</span>{" "}
        {detailModal.data.hemoglobinLevel ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {detailModal.data.hemoglobinLevel} g/dL
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Chưa có kết quả
          </span>
        )}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Huyết áp:</span>{" "}
        {detailModal.data.bloodPressure ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {detailModal.data.bloodPressure} mmHg
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Chưa đo
          </span>
        )}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Nhiệt độ:</span>{" "}
        {detailModal.data.temperatureC ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {detailModal.data.temperatureC}°C
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Chưa đo
          </span>
        )}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Nhịp tim:</span>{" "}
        {detailModal.data.heartRateBpm ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {detailModal.data.heartRateBpm} BPM
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Chưa đo
          </span>
        )}
      </p>
    </div>
  </div>
</div>

            {/* Ghi chú */}
            {detailModal.data.notes && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Ghi chú:</h4>
                <p className="text-gray-700">{detailModal.data.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay về trang chủ
            </button>
          </div>

          <FilterPanel filters={filters} onFilterChange={setFilters} />

          <BloodHistoryTable
            records={paginatedRecords}
            title="Lịch sử đăng ký hiến máu"
            onViewNote={handleViewNote}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRecords.length / itemsPerPage)}
            itemsPerPage={itemsPerPage}
            totalItems={filteredRecords.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default BloodHistoryPage;
