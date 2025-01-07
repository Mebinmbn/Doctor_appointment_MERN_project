import React, { useEffect, useState } from "react";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import logo from "../../assets/icon/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoNotifications } from "react-icons/io5";
import { clearUser } from "../../app/featrue/userSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { INotification } from "../../../../server/src/models/notificationModel";
import api from "../../api/api";
import { useSocket } from "../../contexts/SocketContexts";
import { useChat } from "../../contexts/ChatContext";

interface User {
  name: string;
  id: string;
  role: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { openChat } = useChat();
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as User | null;
  const dispatch = useDispatch();
  const socket = useSocket();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    dispatch(clearUser());
    toast("Logged out successfully");
  };

  useEffect(() => {
    if (!token) {
      dispatch(clearUser());
    } else {
      fetchNotifications();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", user?.id);
    socket.on("notification", (notification: INotification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.content);
    });
    return () => {
      socket.off("notification");
    };
  }, [socket, user?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notification/${user?.id}`, {
        headers: { "User-Type": "patient" },
      });
      if (response.data.success) {
        const fetchedNotifications = response.data.notifications;
        const combinedNotifications = [
          ...notifications,
          ...fetchedNotifications.filter(
            (notif: INotification) =>
              !notifications.find((existing) => existing._id === notif._id)
          ),
        ];
        setNotifications(combinedNotifications);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error in fetching notifications:", axiosError);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = async () => {
    console.log("toggle notification");
    const response = await api.put(`/notification/read/${user?.id}`);
    console.log(response.data.success);

    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    if (socket) {
      socket.on("chatNotification", (data) => {
        console.log("Chat Notification:", data);

        openChat(
          data.room,
          user?.name || "Patient",
          data.senderId,
          data.message.sender,
          user?.id || ""
        );

        toast.info(`New message from ${data.message.sender}`, {
          onClick: () => {
            openChat(
              data.room,
              user?.name || "Patient",
              data.senderId,
              data.message.sender,
              user?.id || ""
            );
          },
        });
      });

      return () => {
        socket.off("chatNotification");
      };
    }
  }, [socket, openChat]);

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
                to="/"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                About
              </Link>
              <Link
                to="/"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            <Link to="/profile">
              <h1 className="text-[#007E85] font-bold">
                {user?.name.toUpperCase()}
              </h1>
            </Link>
            {user ? (
              <>
                <div className="relative flex ">
                  <IoNotifications
                    className="text-blue-800 h-5 w-5 cursor-pointer"
                    onClick={toggleNotifications}
                  />
                  {notifications.length > 0 ? (
                    <div className="Notification_count absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 border-2 rounded-full w-5 h-5 bg-red-600 text-white flex items-center justify-center">
                      {notifications.length}
                    </div>
                  ) : null}
                  {isNotificationOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <ul className="p-2">
                        {notifications.length === 0 ? (
                          <li className="text-gray-500">No notifications</li>
                        ) : (
                          notifications.map((notification, index) => (
                            <Link to="/notifications" key={index}>
                              <li
                                className={`text-sm ${
                                  notification.type === "approved"
                                    ? "bg-green-200"
                                    : "bg-red-200"
                                } text-black p-1 border-b last:border-b-0`}
                              >
                                {notification.content}
                              </li>
                            </Link>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold hover:bg-green-700 transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
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
        <ul>
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
