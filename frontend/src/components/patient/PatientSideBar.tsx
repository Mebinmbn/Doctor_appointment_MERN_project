import { NavLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { clearUser } from "../../app/featrue/userSlice";

function PatientSideBar() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearUser());
  };
  return (
    <div className="flex content-center justify-center h-screen w-40   ml-1">
      <div className=" h-72 my-auto w-32">
        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/profile">Profile</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/timeSlot">Time Slots</NavLink>
        </div>

        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/appointments">Appointments</NavLink>
        </div>

        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/doctor/timeSlotForm">Create Time Slot</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-4 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Payments</NavLink>
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

export default PatientSideBar;
