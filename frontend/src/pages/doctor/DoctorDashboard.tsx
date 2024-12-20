import { useEffect } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!doctor) {
      navigate("/doctor/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [doctor, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />

      <div className="bg-gray-200 h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default DoctorDashboard;
