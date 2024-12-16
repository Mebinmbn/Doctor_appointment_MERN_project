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
import PatientDetails from "./patient/pages/PatientDetails";
import PaymentPage from "./patient/pages/PaymentPage";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";
import ErrorPage from "./components/ErrorPage";
import AdminAppointments from "./admin/pages/AdminAppointments";

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
          <Route path="/patientDetails" element={<PatientDetails />} />
          <Route path="/paymentPage" element={<PaymentPage />} />
          {/* doctorRoutes */}
          <Route path="/doctorSignup" element={<DoctorRegister />} />
          <Route path="/doctorSignin" element={<DoctorSignin />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctorAppointments" element={<DoctorAppointments />} />
          {/* adminRoutes */}
          <Route path="/adminSignin" element={<AdminSignin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminApplications" element={<DoctorsList />} />
          <Route path="/adminDoctors" element={<AllDoctors />} />
          <Route path="/adminPatients" element={<AllPatients />} />
          <Route path="/adminAppointments" element={<AdminAppointments />} />

          {/* errorPage */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
