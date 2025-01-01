import Navbar from "../../components/patient/Navbar";
import MedicalRecord from "../../components/MedicalRecord";
import { useLocation } from "react-router-dom";

function MedicalRecords() {
  const location = useLocation();
  const { appointmentId } = location.state || null;
  return (
    <div>
      <Navbar />
      <MedicalRecord appointmentId={appointmentId} />
    </div>
  );
}

export default MedicalRecords;
