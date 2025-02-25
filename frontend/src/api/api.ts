import axios from "axios";
import {
  clearToken,
  getLoginUrl,
  getToken,
  setToken,
} from "../utility/apiUtility";

const api = axios.create({
  baseURL: "https://befine.site/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const userType = config.headers["User-Type"];

    if (userType) {
      const token = getToken(userType);

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
  async (error) => {
    const originalRequest = error.config;
    const userType = error.config.headers["User-Type"];

    if (error.response && error.response.status === 403) {
      clearToken(userType);
      window.location.href = getLoginUrl(userType);
    } else if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "https://befine.site/api/token",
          {},
          { withCredentials: true }
        );

        setToken(userType, data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
