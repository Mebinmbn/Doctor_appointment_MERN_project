import { NavLink, useNavigate } from "react-router-dom";
import { clearDoctor } from "../../app/featrue/doctorSlice";
import { useDispatch } from "react-redux";

function DoctorNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearDoctor());
    navigate("/doctor/login");
  };
  return (
    <div className="flex content-center justify-center h-screen w-40  ml-1">
      <div className=" h-72 my-auto w-32">
        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor">Dahboard</NavLink>
        </div>

        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/appointments">Appointments</NavLink>
        </div>

        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/timeSlotForm">Manage Time</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/notifications">Notifications</NavLink>
        </div>

        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/leave">Apply Leave</NavLink>
        </div>

        <div
          className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default DoctorNav;
