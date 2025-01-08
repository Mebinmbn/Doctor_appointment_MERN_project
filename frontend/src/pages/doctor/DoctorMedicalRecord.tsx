import DoctorNav from "../../components/doctor/DoctorNav";

import MedicalRecord from "../../components/MedicalRecord";
import { useLocation } from "react-router-dom";

function DoctorMedicalRecord() {
  const location = useLocation();
  const { appointmentId } = location.state || null;
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />

      <MedicalRecord appointmentId={appointmentId} />
    </div>
  );
}

export default DoctorMedicalRecord;
