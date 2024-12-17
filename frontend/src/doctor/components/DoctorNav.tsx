import { NavLink } from "react-router-dom";
import { clearDoctor } from "../../app/featrue/doctorSlice";
import { useDispatch } from "react-redux";

function DoctorNav() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearDoctor());
  };
  return (
    <div className="flex content-center justify-center h-screen w-40  ml-1">
      <div className=" h-72 my-auto w-32">
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Dahboard</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctorTimeSlot">Time Slots</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctorAppointments">Appointments</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Applications</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Payments</NavLink>
        </div>

        <div
          className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default DoctorNav;
