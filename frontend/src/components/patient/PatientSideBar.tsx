import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaBell,
  FaWallet,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearUser } from "../../app/featrue/userSlice";

function PatientSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/");
  };
  return (
    <div className="flex content-center justify-center h-full md:h-screen w-full md:w-40 ml-1">
      <div className="flex flex-row md:flex-col md:justify-center items-center md:items-start w-full md:w-32 md:h-full">
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/profile">
            <FaUser className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Profile</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/">
            <FaHome className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Home</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/appointments">
            <FaCalendarAlt className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Appointments</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/notifications">
            <FaBell className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Notifications</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/wallet">
            <FaWallet className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Wallet</span>
          </NavLink>
        </div>
        <div className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg">
          <NavLink to="/chats">
            <FaComments className="inline-block md:hidden" />
            <span className="hidden md:inline-block">Messages</span>
          </NavLink>
        </div>
        <div
          className="h-9 border-[1px] w-full md:w-32 text-center p-1 m-2 md:m-4 rounded-lg bg-white text-[#007E85] font-bold text-lg cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="inline-block md:hidden" />
          <span className="hidden md:inline-block">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default PatientSideBar;
