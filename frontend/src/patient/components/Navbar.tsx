import React, { useEffect, useState } from "react";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import logo from "../../assets/icon/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../types/user";
import { clearUser } from "../../app/featrue/userSlice";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  const dispatch = useDispatch();
  console.log(user);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    dispatch(clearUser());
    toast("Logged out successfully");
  };

  useEffect(() => {
    if (!token) {
      handleLogout();
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <img src={logo} alt="DoctorAppoint Logo" className="h-10" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Doctors
              </Link>
              <Link
                to="/about"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            <h1 className="text-[#007E85] font-bold">
              {user?.name.toUpperCase()}
            </h1>
            {user ? (
              <button
                className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold hover:bg-green-700 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold hover:bg-green-700 transition duration-300">
                  Login
                </button>
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6 text-gray-500 hover:text-green-500"
                x-show="!isOpen"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`mobile-menu ${isOpen ? "" : "hidden"} md:hidden`}>
        <ul className="">
          <li className="active">
            <Link
              to="/"
              className="block text-sm px-2 py-4 text-white bg-green-500 font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/doctors"
              className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
            >
              Doctors
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
