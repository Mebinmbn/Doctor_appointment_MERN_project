import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientLogin from "./pages/patient/PatientLogin";
import { ToastContainer } from "react-toastify";
import OTPVerification from "./pages/patient/OtpVeryfication";
import Home from "./pages/patient/Home";
import DoctorRegister from "./pages/doctor/DoctorRegister";
import DoctorSignin from "./pages/doctor/DoctorSignin";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminSignin from "./pages/admin/AdminSignin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorsList from "./pages/admin/DoctorsList";
import Doctors from "./pages/patient/Doctors";
import AllDoctors from "./pages/admin/AllDoctors";
import AllPatients from "./pages/admin/AllPatients";
import ForgotPassword from "./pages/patient/ForgotPassword";
import ResetPassword from "./pages/patient/ResetPassword";
import PickDateTime from "./pages/patient/PickDateTime";
import PatientDetails from "./pages/patient/PatientDetails";
import PaymentPage from "./pages/patient/PaymentPage";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import ErrorPage from "./components/ErrorPage";
import AdminAppointments from "./pages/admin/AdminAppointments";
import DoctorTimeSlot from "./pages/doctor/DoctorTimeSlot";
import TimeSlotForm from "./pages/doctor/TimeSlotForm";
import Profile from "./pages/patient/Profile";
import Appointments from "./pages/patient/Appointments";

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
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/pickDate" element={<PickDateTime />} />
          <Route path="/patientDetails" element={<PatientDetails />} />
          <Route path="/paymentPage" element={<PaymentPage />} />
          <Route path="/appointments" element={<Appointments />} />
          {/* doctorRoutes */}
          <Route path="/doctor/signup" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorSignin />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/timeSlot" element={<DoctorTimeSlot />} />
          <Route path="/doctor/timeSlotForm" element={<TimeSlotForm />} />
          {/* adminRoutes */}
          <Route path="/admin/login" element={<AdminSignin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<DoctorsList />} />
          <Route path="/admin/doctors" element={<AllDoctors />} />
          <Route path="/admin/patients" element={<AllPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />

          {/* errorPage */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
