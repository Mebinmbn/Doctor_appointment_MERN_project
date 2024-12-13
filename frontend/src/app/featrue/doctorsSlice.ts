import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Doctor } from "./../../types/doctor";

const initialState = {
  doctors: <Doctor[]>[],
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctorsArray: (state, action: PayloadAction<{ doctors: Doctor[] }>) => {
      state.doctors = action.payload.doctors;
    },
  },
});

export const { setDoctorsArray } = doctorsSlice.actions;
export default doctorsSlice.reducer;
