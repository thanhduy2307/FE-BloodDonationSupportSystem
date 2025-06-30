import axios from "axios";

const api = axios.create({
  baseURL: "https://7ad9-171-253-5-92.ngrok-free.app/api/",
  headers: {
     'ngrok-skip-browser-warning': 'true'
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
