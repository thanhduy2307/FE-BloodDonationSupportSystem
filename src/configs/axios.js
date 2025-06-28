import axios from "axios";

const api = axios.create({
  baseURL: "https://1a81-14-226-226-52.ngrok-free.app/api/",
  headers: {
    Accept: "application/json", // 👈 THÊM DÒNG NÀY
  },
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
