import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { INotification } from "../../../../server/src/models/notificationModel";
import { IoNotifications } from "react-icons/io5";
import { AxiosError } from "axios";
import api from "../../api/api";
import { useSocket } from "../../contexts/SocketContexts";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import AnimatedMessage from "../Icons/AnimatedMessage";
import sound from "../../assets/sound/chime_ding.mp3";

function DoctorTopBar() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [chatNotification, setChatNotification] = useState(false);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const socket = useSocket();
  const { openChat } = useChat();

  const play = () => {
    new Audio(sound).play();
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", doctor?.id, doctor?.id);
    socket.on("notification", (notification: INotification) => {
      setNotifications((prev) => [...prev, notification]);
      toast.info(notification.content);
    });
    return () => {
      socket.off("notification");
    };
  }, [doctor?.id, socket]);

  play();

  useEffect(() => {
    if (socket) {
      socket.on("chatNotification", (data) => {
        console.log("Chat Notification:", data);
        setChatNotification(true);
        openChat(
          data.room,
          doctor?.name || "Doctor",
          data.senderId,
          data.message.sender,
          doctor?.id || ""
        );

        toast.info(`New message: ${data.message.text}`, {
          onClick: () => {
            openChat(
              data.room,
              doctor?.name || "Doctor",
              data.senderId,
              data.message.sender,
              doctor?.id || ""
            );
          },
        });
      });

      return () => {
        socket.off("chatNotification");
      };
    }
  }, [socket, openChat, doctor?.name, doctor?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notification/${doctor?.id}`, {
        headers: { "User-Type": "doctor" },
      });
      if (response.data.success) {
        console.log(response.data);
        const fetchedNotifications = response.data.notifications;
        const combinedNotifications = [
          ...notifications,
          ...fetchedNotifications.filter(
            (notif: INotification) =>
              !notifications.find((existing) => existing._id === notif._id)
          ),
        ];
        const sortedNotifications = combinedNotifications.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error in signup request:", axiosError);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotifications = async () => {
    const response = await api.put(`/notification/read/${doctor?.id}`);
    console.log(response.data.success);
    fetchNotifications();
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div>
      <div className="flex justify-evenly mx-5 w-[90%]  mx-auto">
        <div className=" rounded-xl w-fit flex  p-2 ml-auto ">
          <div className="relative flex ">
            {chatNotification && (
              <div className="mt-0">
                <AnimatedMessage />
              </div>
            )}
            <IoNotifications
              className="text-blue-800 h-5 w-5 cursor-pointer mt-4"
              onClick={toggleNotifications}
            />
            {notifications.length > 0 ? (
              <div className="Notification_count absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 border-2 rounded-full w-5 h-5 bg-red-600 text-white flex items-center justify-center">
                {notifications.length}
              </div>
            ) : null}
            {isNotificationOpen && (
              <div className="absolute top-full right-0  w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <ul className="p-2">
                  {notifications.length === 0 ? (
                    <li className="text-gray-500">No notifications</li>
                  ) : (
                    notifications.map((notification, index) => (
                      <Link to="/doctor/notifications">
                        <li
                          key={index}
                          className={`text-sm ${
                            notification.type === "applied"
                              ? "bg-yellow-200"
                              : "bg-red-200"
                          } text-black p-1 border-b border-2 last:border-b-0`}
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
          <p className="text-black font-bold ml-2 mt-4">
            DR. {doctor?.name.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorTopBar;
