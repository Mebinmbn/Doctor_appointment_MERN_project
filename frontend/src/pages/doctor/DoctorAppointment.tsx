import { useLocation } from "react-router-dom";
import AppointmentDetails from "../../components/AppoitmentDetails";
import DoctorNav from "../../components/doctor/DoctorNav";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";

function DoctorAppointment() {
  const location = useLocation();
  const { appointmentId } = location.state || null;
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />
      <div className="bg-white h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <AppointmentDetails appointmentId={appointmentId} userType="doctor" />
      </div>
    </div>
  );
}

export default DoctorAppointment;
