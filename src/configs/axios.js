import axios from "axios";

const api = axios.create({
  baseURL: "https://6fc5-118-69-70-166.ngrok-free.app/api",
});

api.interceptors.request.use(
    function (config) {
      // Do something before request is sent
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
