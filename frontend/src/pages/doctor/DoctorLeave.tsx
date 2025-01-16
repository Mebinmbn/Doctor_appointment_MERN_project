import { FormEvent, useState } from "react";
import api from "../../api/api";
import DoctorNav from "../../components/doctor/DoctorNav";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import ConfirmationModal from "../../components/ConfirmationModal";

interface ErrorResponse {
  error: string;
}

const DoctorLeave: React.FC = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date should not be less than start date");
      return;
    }
    showConfirmationModal("Do you want to apply for leave?", async () => {
      try {
        const response = await api.post("doctor/leave/apply", {
          leaveType,
          startDate,
          endDate,
          reason,
        });
        toast.success(response.data.message);
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        toast.error(axiosError.response?.data.error);
      }
      setIsConfirmModalOpen(false);
    });
  };

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />
      <div className="bg-gray-200 h-fit min-h-[98vh] w-full md:w-[88vw] text-center p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Apply for Leave
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Reason for Leave"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Apply for Leave
          </button>
        </form>
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
};

export default DoctorLeave;
