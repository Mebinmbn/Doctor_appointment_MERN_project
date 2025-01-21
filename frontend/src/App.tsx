import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/patient/Profile";
import Doctors from "./pages/patient/Doctors";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components
const PatientLogin = lazy(() => import("./pages/patient/PatientLogin"));
const OTPVerification = lazy(() => import("./pages/patient/OtpVeryfication"));
const Home = lazy(() => import("./pages/patient/Home"));
const DoctorRegister = lazy(() => import("./pages/doctor/DoctorRegister"));
const DoctorSignin = lazy(() => import("./pages/doctor/DoctorSignin"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const AdminSignin = lazy(() => import("./pages/admin/AdminSignin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const DoctorsList = lazy(() => import("./pages/admin/DoctorsList"));
const AllDoctors = lazy(() => import("./pages/admin/AllDoctors"));
const AllPatients = lazy(() => import("./pages/admin/AllPatients"));
const ForgotPassword = lazy(() => import("./pages/patient/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/patient/ResetPassword"));
const PickDateTime = lazy(() => import("./pages/patient/PickDateTime"));
const PatientDetails = lazy(() => import("./pages/patient/PatientDetails"));
const PaymentPage = lazy(() => import("./pages/patient/PaymentPage"));
const Aknowledement = lazy(() => import("./pages/patient/Aknowledement"));
const Appointments = lazy(() => import("./pages/patient/Appointments"));
const Appointment = lazy(() => import("./pages/patient/Appointment"));
const MedicalRecords = lazy(() => import("./pages/patient/MedicalRecords"));
const Notifications = lazy(() => import("./pages/patient/Notifications"));
const Wallet = lazy(() => import("./pages/patient/Wallet"));
const Chats = lazy(() => import("./pages/patient/Chats"));

const DoctorAppointments = lazy(
  () => import("./pages/doctor/DoctorAppointments")
);
const DoctorAppointment = lazy(
  () => import("./pages/doctor/DoctorAppointment")
);
const DoctorMedicalRecord = lazy(
  () => import("./pages/doctor/DoctorMedicalRecord")
);
const DoctorMedicalForm = lazy(
  () => import("./pages/doctor/DoctorMedicalForm")
);
const DoctorTimeSlot = lazy(() => import("./pages/doctor/DoctorTimeSlot"));
const TimeSlotForm = lazy(() => import("./pages/doctor/TimeSlotForm"));
const DoctorNotifications = lazy(
  () => import("./pages/doctor/DoctorNotifications")
);
const DoctorLeave = lazy(() => import("./pages/doctor/DoctorLeave"));
const DoctorChats = lazy(() => import("./pages/doctor/DoctorChats"));
const DoctorPayments = lazy(() => import("./pages/doctor/DoctorPayments"));

const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const LeaveRequests = lazy(() => import("./pages/admin/LeaveRequests"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const ChatPage = lazy(() => import("./components/ChatPage"));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
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
            <Route
              path="/chats"
              element={
                <ProtectedRoute role="user">
                  <Chats />
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
              path="/doctor/timeSlots"
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
            <Route
              path="doctor/chats"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorChats />
                </ProtectedRoute>
              }
            />
            <Route
              path="doctor/payments"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorPayments />
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
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute role="admin">
                  <AdminPayments />
                </ProtectedRoute>
              }
            />

            {/* errorPage */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatPage />
      </Suspense>
    </>
  );
}

export default App;
