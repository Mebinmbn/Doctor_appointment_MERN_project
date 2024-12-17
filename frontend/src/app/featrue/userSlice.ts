import { createSlice } from "@reduxjs/toolkit";
import { Doctor } from "../../types/doctor";

interface User {
  name: string;
  role: string;
  id: string;
  isBlocked: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  doctorToConsult: Doctor | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") as string) || null,
  token: localStorage.getItem("token") || null,
  doctorToConsult:
    JSON.parse(localStorage.getItem("doctorToConsult") as string) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      console.log(state.user);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.doctorToConsult = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("doctorToConsult");
    },
    setDoctorToConsult: (state, action) => {
      state.doctorToConsult = action.payload;
      localStorage.setItem("doctorToConsult", JSON.stringify(action.payload));
    },
    clearDoctorToConsult: (state) => {
      state.doctorToConsult = null;
      localStorage.removeItem("doctorToConsult");
    },
  },
});

export const { setUser, clearUser, setDoctorToConsult, clearDoctorToConsult } =
  userSlice.actions;
export default userSlice.reducer;
