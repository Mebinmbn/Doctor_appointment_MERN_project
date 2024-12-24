import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { ILeave } from "./../../../../server/src/models/leaveModel";

function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<ILeave[]>([]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await api.get("admin/leave/requests");
        setLeaveRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  //   const updateLeaveStatus = async (id, status) => {
  //     try {
  //       const response = await api.put(`/leave/update/${id}`, { status });
  //       toast.success(response.data.message);
  //       setLeaveRequests((prevRequests) =>
  //         prevRequests.map((request) =>
  //           request._id === id ? { ...request, status } : request
  //         )
  //       );
  //     } catch (error) {
  //       toast.error("Error updating leave status");
  //       console.error("Error updating leave status:", error);
  //     }
  //   };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Doctor</th>
            <th className="py-2 px-4 border-b">Leave Type</th>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Reason</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave) => (
            <tr key={leave._id}>
              <td className="py-2 px-4 border-b">{leave.doctorId.name}</td>
              <td className="py-2 px-4 border-b">{leave.leaveType}</td>
              <td className="py-2 px-4 border-b">
                {new Date(leave.startDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{leave.reason}</td>
              <td className="py-2 px-4 border-b">{leave.status}</td>
              <td className="py-2 px-4 border-b">
                {leave.status === "Pending" && (
                  <div className="flex space-x-2">
                    <button
                      //   onClick={() => updateLeaveStatus(leave._id, "Approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                      Approve
                    </button>
                    <button
                      //   onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequests;
