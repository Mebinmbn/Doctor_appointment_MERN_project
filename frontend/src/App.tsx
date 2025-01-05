import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientLogin from "./pages/patient/PatientLogin";
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
import Notifications from "./pages/patient/Notifications";
import DoctorNotifications from "./pages/doctor/DoctorNotifications";
import ProtectedRoute from "./ProtectedRoute";
import DoctorLeave from "./pages/doctor/DoctorLeave";
import LeaveRequests from "./pages/admin/LeaveRequests";
import Aknowledement from "./pages/patient/Aknowledement";
import Appointment from "./pages/patient/Appointment";
import DoctorAppointment from "./pages/doctor/DoctorAppointment";
import DoctorMedicalForm from "./pages/doctor/DoctorMedicalForm";
import MedicalRecords from "./pages/patient/MedicalRecords";
import DoctorMedicalRecord from "./pages/doctor/DoctorMedicalRecord";
import Wallet from "./pages/patient/Wallet";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* patient */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="user">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute role="user">
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickDate"
            element={
              <ProtectedRoute role="user">
                <PickDateTime />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patientDetails"
            element={
              <ProtectedRoute role="user">
                <PatientDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paymentPage"
            element={
              <ProtectedRoute role="user">
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aknowledgement"
            element={
              <ProtectedRoute role="user">
                <Aknowledement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute role="user">
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRoute role="user">
                <Appointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicalrecord"
            element={
              <ProtectedRoute role="user">
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute role="user">
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute role="user">
                <Wallet />
              </ProtectedRoute>
            }
          />
          {/* doctorRoutes */}
          <Route path="/doctor/signup" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorSignin />} />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role="doctor">
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointment"
            element={
              <ProtectedRoute role="doctor">
                <DoctorAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/medicalrecord"
            element={
              <ProtectedRoute role="doctor">
                <DoctorMedicalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/medicalform"
            element={
              <ProtectedRoute role="doctor">
                <DoctorMedicalForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/timeSlot"
            element={
              <ProtectedRoute role="doctor">
                <DoctorTimeSlot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/timeSlotForm"
            element={
              <ProtectedRoute role="doctor">
                <TimeSlotForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/notifications"
            element={
              <ProtectedRoute role="doctor">
                <DoctorNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/leave"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLeave />
              </ProtectedRoute>
            }
          />
          {/* adminRoutes */}
          <Route path="/admin/login" element={<AdminSignin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute role="admin">
                <DoctorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute role="admin">
                <AllDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute role="admin">
                <AllPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute role="admin">
                <AdminAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute role="admin">
                <LeaveRequests />
              </ProtectedRoute>
            }
          />

          {/* errorPage */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      <ChatPage />
    </>
  );
}

export default App;
