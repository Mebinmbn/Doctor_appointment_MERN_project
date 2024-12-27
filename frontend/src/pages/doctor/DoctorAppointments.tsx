import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import DoctorNav from "../../components/doctor/DoctorNav";
import { Appointment } from "../../types/appointment";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";
import ConfirmationModal from "../../components/confirmationModal";

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!doctor) {
      navigate("/doctor/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [doctor, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!doctor) return;

    try {
      const response = await api.get(`doctor/appointments/${doctor.id}`, {
        headers: {
          "User-Type": "doctor",
        },
      });

      if (response.data) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor) fetchAppointments();
  }, [doctor, fetchAppointments]);
  console.log(appointments);

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

  const handleCancel = async (id: string) => {
    showConfirmationModal(
      "Do you want to cancel this appointment?",
      async () => {
        try {
          const response = await api.put(
            `/doctor/appointments/cancel/${id}`,
            { role: "Appointments" },
            {
              headers: {
                "User-Type": "doctor",
              },
            }
          );
          if (response.data.success) {
            fetchAppointments();
            toast.success("Appointment Cancelled");
          }
        } catch (error) {
          console.error("Error cancelling appointment:", error);
          toast.error("Error in cancellation");
        }
        setIsConfirmModalOpen(false);
      }
    );
  };

  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />
      <div className="bg-white h-[98vh] w-[88vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl mt-5 shadow-lg rounded-lg bg-[#007E85]">
            <h2 className="text-2xl font-bold mb-4 text-white p-4 border-b">
              Appointments
            </h2>
            <table className="min-w-full bg-[#007E85] border">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-white border-b">Patient</th>
                  <th className="py-2 px-4 text-white border-b">Date</th>
                  <th className="py-2 px-4 text-white border-b">Time</th>
                  <th className="py-2 px-4 text-white border-b">Payment</th>
                  <th className="py-2 px-4 text-white border-b">Status</th>
                  <th className="py-2 px-4 text-white border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="py-2 px-4 text-white border-b">
                        {appointment.patientId?.firstName}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {appointment.date.toString().slice(0, 10)}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {appointment.time}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {appointment.payment}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {appointment.status}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        <div>
                          <button className="bg-blue-500 rounded-xl px-2 py-1 border-[1px] mr-2">
                            View
                          </button>
                          {appointment.status !== "cancelled" && (
                            <button
                              className="bg-red-500 rounded-xl p-1 border-[1px] mr-2"
                              onClick={() => handleCancel(appointment._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-4 text-white border-b" colSpan={6}>
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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

export default DoctorAppointments;
