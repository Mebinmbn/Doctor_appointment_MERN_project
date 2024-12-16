import { createSlice } from "@reduxjs/toolkit";
interface Doctor {
  name: string;
  role: string;
  id: string;
  isApproved: boolean;
}

interface AuthState {
  doctor: Doctor | null;
  doctorToken: string | null;
}

const initialState: AuthState = {
  doctor: JSON.parse(localStorage.getItem("doctor") as string) || null,
  doctorToken: localStorage.getItem("doctorToken") || null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload.doctor;
      state.doctorToken = action.payload.doctorToken;
      console.log(state.doctor);
      localStorage.setItem("doctor", JSON.stringify(action.payload.doctor));
      localStorage.setItem("doctorToken", action.payload.doctorToken);
    },
    clearDoctor: (state) => {
      state.doctor = null;
      state.doctorToken = null;

      localStorage.removeItem("doctor");
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("role");
    },
  },
});

export const { setDoctor, clearDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
