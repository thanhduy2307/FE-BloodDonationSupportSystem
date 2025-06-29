import axios from "axios";

const api = axios.create({
  baseURL: "https://1db2-222-253-95-253.ngrok-free.app/api/",
  headers: {
     'ngrok-skip-browser-warning': 'true',
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
