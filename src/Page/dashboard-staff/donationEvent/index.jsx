import React, { useState } from "react";

function CreateBloodEvent() {
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Giả sử gửi lên API thành công:
    console.log("Event Created:", formData);
    setNotification("Tạo sự kiện thành công!");

    // Reset form (tùy chọn)
    setFormData({
      eventName: "",
      location: "",
      date: "",
      time: "",
      description: "",
    });

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        Tạo Sự Kiện Hiến Máu
      </h2>

      {notification && (
        <div className="bg-green-500 text-white text-sm p-3 rounded mb-4">
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên sự kiện</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Địa điểm</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Giờ</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Tạo sự kiện
        </button>
      </form>
    </div>
  );
}

export default CreateBloodEvent;
