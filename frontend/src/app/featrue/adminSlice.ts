import { createSlice } from "@reduxjs/toolkit";

interface Admin {
  name: string;
  role: string;
  id: string;
  isApproved: boolean;
}

interface AuthState {
  admin: Admin | null;
  adminToken: string | null;
}

const initialState: AuthState = {
  admin: JSON.parse(localStorage.getItem("admin") as string) || null,
  adminToken: localStorage.getItem("adminToken") || null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.adminToken = action.payload.adminToken;

      localStorage.setItem("admin", JSON.stringify(action.payload.admin));
      localStorage.setItem("adminToken", action.payload.adminToken);
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;

      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
