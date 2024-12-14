import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./featrue/userSlice";
import adminReducer from "./featrue/adminSlice";
import doctorReducer from "./featrue/doctorSlice";
import doctorsReducer from "./featrue//doctorsSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    doctor: doctorReducer,
    doctors: doctorsReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
