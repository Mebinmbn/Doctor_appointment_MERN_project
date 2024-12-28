import { useLocation } from "react-router-dom";
import AppoitmentDetails from "../../components/AppoitmentDetails";
import Navbar from "../../components/patient/Navbar";

function Appointment() {
  const location = useLocation();
  const { appointmentId } = location.state || null;
  return (
    <div>
      <Navbar />
      <AppoitmentDetails appointmentId={appointmentId} userType="patient" />
    </div>
  );
}

export default Appointment;
