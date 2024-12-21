import axios from "axios";
import { clearToken, getLoginUrl, getToken } from "../utility/apiUtility";
// import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const userType = config.headers["User-Type"];
    console.log(userType);
    if (userType) {
      const token = getToken(userType);
      console.log("token", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response.status);
    if (
      (error.response && error.response.status === 403) ||
      error.response.status === 401
    ) {
      const userType = error.config.headers["User-Type"];

      clearToken(userType);
      window.location.href = getLoginUrl(userType);
    }
    return Promise.reject(error);
  }
);

export default api;
