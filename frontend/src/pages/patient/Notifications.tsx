import { useCallback, useEffect, useState } from "react";
import PatientSideBar from "../../components/patient/PatientSideBar";
import PatientTopBar from "../../components/patient/PatientTopBar";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { toast } from "react-toastify";
import { INotification } from "../../../../server/src/models/notificationModel";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state: RootState) => state.user.user);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get(
        `/patients/notifications/${user?.id}?page=${currentPage}&limit=7`,
        {
          headers: { "User-Type": "patient" },
        }
      );
      console.log(response);
      if (response.data.success) {
        setNotifications(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error in fetching notifications:", error);
      toast.error("Error in fetching notifications");
    }
  }, [currentPage, user?.id]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, currentPage, totalPages, fetchNotifications]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <PatientSideBar />
      <div className="bg-white h-fit min-h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <PatientTopBar />
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl mt-5 shadow-lg rounded-lg bg-[#007E85]">
            <h2 className="text-2xl font-bold mb-4 text-white p-4 border-b">
              Notifications
            </h2>

            {notifications.length > 0 ? (
              notifications.map((notification: INotification, index) => (
                <div
                  key={index}
                  className={`h-fit w-[86%] bg-red-200 text-left p-2 m-2 mx-auto`}
                >
                  {notification.content}
                </div>
              ))
            ) : (
              <div className="py-2 px-4 text-white border-b">
                No notifications found
              </div>
            )}

            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 mb-1 ${
                      currentPage === page
                        ? "bg-blue-500 text-white rounded-full"
                        : "text-black"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
