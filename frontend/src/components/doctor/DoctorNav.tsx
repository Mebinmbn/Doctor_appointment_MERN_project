import { NavLink, useNavigate } from "react-router-dom";
import { clearDoctor } from "../../app/featrue/doctorSlice";
import { useDispatch } from "react-redux";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaSignOutAlt,
  FaCommentDots,
  FaMoneyBill,
} from "react-icons/fa";

function DoctorNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearDoctor());
    navigate("/doctor/login");
  };
  return (
    <div className="flex content-center justify-center h-full md:h-screen w-full md:w-40 ml-1">
      <div className="flex flex-row md:flex-col md:justify-center items-center md:items-start w-full md:w-32 md:h-full">
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor">
            <FaTachometerAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Dashboard</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/appointments">
            <FaCalendarAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Appointments</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/timeSlotForm">
            <FaClock className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Manage Time</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/notifications">
            <FaBell className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Notifications</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/leave">
            <FaTachometerAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Apply Leave</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/chats">
            <FaCommentDots className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Messages</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-fit md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/doctor/payments">
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

export default DoctorNav;
