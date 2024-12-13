import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientLogin from "./patient/pages/PatientLogin";
import { ToastContainer } from "react-toastify";
import OTPVerification from "./patient/pages/OtpVeryfication";
import Home from "./patient/pages/Home";
import DoctorRegister from "./doctor/pages/DoctorRegister";
import DoctorSignin from "./doctor/pages/DoctorSignin";
import DoctorDashboard from "./doctor/pages/DoctorDashboard";
import AdminSignin from "./admin/pages/AdminSignin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import DoctorsList from "./admin/pages/DoctorsList";
import Doctors from "./patient/pages/Doctors";
import AllDoctors from "./admin/pages/AllDoctors";
import AllPatients from "./admin/pages/AllPatients";
import ForgotPassword from "./patient/pages/ForgotPassword";
import ResetPassword from "./patient/pages/ResetPassword";
import PickDateTime from "./patient/pages/PickDateTime";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/pickDate" element={<PickDateTime />} />
        </Routes>
        <Routes>
          <Route path="/doctorSignup" element={<DoctorRegister />} />
          <Route path="/doctorSignin" element={<DoctorSignin />} />
          <Route path="/doctorDashboard" element={<DoctorDashboard />} />
        </Routes>
        <Routes>
          <Route path="/adminSignin" element={<AdminSignin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminApplications" element={<DoctorsList />} />
          <Route path="/adminDoctors" element={<AllDoctors />} />
          <Route path="/adminPatients" element={<AllPatients />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
