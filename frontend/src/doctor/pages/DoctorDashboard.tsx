import { useEffect } from "react";
import DoctorNav from "../components/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctor) {
      navigate("/doctorSignin");
    }
  });
  return (
    <div>
      <DoctorNav />
      <h1>Doctor Dashboard</h1>
    </div>
  );
}

export default DoctorDashboard;
