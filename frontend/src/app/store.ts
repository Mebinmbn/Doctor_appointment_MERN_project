import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./featrue/userSlice";
import adminReducer from "./featrue/adminSlice";
import doctorReducer from "./featrue/doctorSlice";
const store = configureStore({
  reducer: {
    auth: userReducer,
    admin: adminReducer,
    doctor: doctorReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
