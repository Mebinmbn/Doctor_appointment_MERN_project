import { useEffect } from "react";
import DoctorNav from "../components/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctor) {
      navigate("/doctorSignin");
      toast.warn("Login to continue");
    }
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />
      <div className="bg-gray-200 h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default DoctorDashboard;
