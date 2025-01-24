import store from "../app/store";
import { clearAdmin } from "../app/featrue/adminSlice";
import { clearDoctor } from "../app/featrue/doctorSlice";
import { clearUser } from "../app/featrue/userSlice";

export const getToken = (userType: string) => {
  switch (userType) {
    case "patient":
      return localStorage.getItem("token");
    case "admin":
      return localStorage.getItem("adminToken");
    case "doctor":
      return localStorage.getItem("doctorToken");
    default:
      return null;
  }
};

export const clearToken = (userType: string) => {
  switch (userType) {
    case "patient":
      store.dispatch(clearUser());
      break;
    case "admin":
      store.dispatch(clearAdmin());
      break;
    case "doctor":
      store.dispatch(clearDoctor());
      break;
    default:
      break;
  }
};

export const getLoginUrl = (userType: string) => {
  switch (userType) {
    case "patient":
      return "/login";
    case "admin":
      return "/admin/login";
    case "doctor":
      return "/doctor/login";
    default:
      return "/login";
  }
};

export const setToken = (userType: string, token: string) => {
  switch (userType) {
    case "patient":
      return localStorage.setItem("token", token);
    case "admin":
      return localStorage.setItem("adminToken", token);
    case "doctor":
      return localStorage.setItem("doctorToken", token);
    default:
      return null;
  }
};
