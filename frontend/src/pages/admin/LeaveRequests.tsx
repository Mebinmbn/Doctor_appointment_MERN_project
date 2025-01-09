import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { ILeave } from "./../../../../server/src/models/leaveModel";
import AdminNav from "../../components/admin/AdminNav";
import AdminTopBar from "../../components/admin/AdminTopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";

function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<ILeave[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );

  const fetchLeaveRequests = async () => {
    try {
      const response = await api.get(
        `admin/leave/requests?page=${currentPage}&limit=7`,
        {
          headers: { "User-Type": "admin" },
        }
      );
      setIsLoading(false);
      setLeaveRequests(response.data.requests);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    setIsLoading(true);
  }, [currentPage]);

  const updateLeaveStatus = async (id: string, status: string) => {
    showConfirmationModal(
      `Do you want to ${status.toLowerCase()} this leave request?`,
      async () => {
        try {
          const response = await api.put(
            `admin/leave/update/${id}`,
            { status },
            {
              headers: { "User-Type": "admin" },
            }
          );
          toast.success(response.data.message);
          fetchLeaveRequests();
        } catch (error) {
          toast.error("Error updating leave status");
          console.error("Error updating leave status:", error);
        }
        setIsConfirmModalOpen(false);
      }
    );
  };

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
        <AdminNav />
        <div className="bg-white h-fit min-h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
          <AdminTopBar />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex justify-center items-center">
              <div className="w-full max-w-6xl mt-5 shadow-lg rounded-lg bg-[#007E85]">
                <h2 className="text-2xl font-bold mb-4 text-white p-4 text-white border-b text-white">
                  Applications
                </h2>
                <table className="min-w-full bg-[#007E85] border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-white border-b">Doctor</th>
                      <th className="py-2 px-4 text-white border-b">
                        Start Date
                      </th>
                      <th className="py-2 px-4 text-white border-b">
                        End Date
                      </th>
                      <th className="py-2 px-4 text-white border-b">Reason</th>
                      <th className="py-2 px-4 text-white border-b">Status</th>
                      <th className="py-2 px-4 text-white border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests?.map((leave: ILeave, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 text-white border-b">
                          {leave.doctorId.firstName} {leave.doctorId.lastName}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {leave.reason}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {leave.status}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          <div>
                            <button
                              className="bg-green-500 rounded-xl p-1 border-[1px] mr-2"
                              onClick={() => {
                                updateLeaveStatus(leave._id, "Approved");
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                updateLeaveStatus(leave._id, "Rejected");
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          )}
        </div>
      </div>
      <ConfirmationModal
        showModal={isConfirmModalOpen}
        message={message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          if (confirmationCallback) confirmationCallback();
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
}

export default LeaveRequests;
