import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientLogin from "./patient/pages/PatientLogin";
import { ToastContainer } from "react-toastify";
import OTPVerification from "./patient/pages/OtpVeryfication";
import Home from "./patient/pages/Home";
import DoctorRegister from "./doctor/pages/DoctorRegister";
import DoctorSignin from "./doctor/pages/DoctorSignin";
import DoctorDashboard from "./doctor/pages/DoctorDashboard";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/otp" element={<OTPVerification />} />
        </Routes>
        <Routes>
          <Route path="/doctorSignup" element={<DoctorRegister />} />
          <Route path="/doctorSignin" element={<DoctorSignin />} />
          <Route path="/doctorDashboard" element={<DoctorDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
