import { NavLink } from "react-router-dom";
import { clearAdmin } from "../../app/featrue/adminSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AdminNav() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAdmin());
    toast.success("Successfully logged out");
  };
  return (
    <div className="flex content-center justify-center h-screen w-40  ml-1">
      <div className=" h-72 my-auto w-32">
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin">Dahboard</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin/patients">Patients</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin/doctors">Doctors</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin/applications">Applications</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin/requests">Requests</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/admin/appointments">Appointments</NavLink>
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

export default AdminNav;
