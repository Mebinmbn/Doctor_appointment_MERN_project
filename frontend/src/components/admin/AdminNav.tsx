import { NavLink } from "react-router-dom";
import { clearAdmin } from "../../app/featrue/adminSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
  FaFileAlt,
  FaEnvelopeOpen,
  FaCalendarAlt,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminNav() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAdmin());
    toast.success("Successfully logged out");
  };

  return (
    <div className="flex content-center justify-center h-full md:h-screen w-full md:w-40 ml-1">
      <div className="flex flex-row md:flex-col md:justify-center items-center md:items-start w-full md:w-32">
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin">
            <FaTachometerAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Dashboard</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/patients">
            <FaUserInjured className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Patients</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/doctors">
            <FaUserMd className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Doctors</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/applications">
            <FaFileAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Applications</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/requests">
            <FaEnvelopeOpen className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Requests</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/appointments">
            <FaCalendarAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Appointments</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/admin/payments">
            <FaMoneyBill className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Payments</span>
          </NavLink>
        </div>
        <div
          className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="inline-block md:hidden" />
          <span className="hidden md:inline-block">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
