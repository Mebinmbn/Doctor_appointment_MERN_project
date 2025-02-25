import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import DoctorNav from "../../components/doctor/DoctorNav";
import { Appointment } from "../../types/appointment";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";

import CancelModal from "../../components/CancelModal";

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [confirmationCallback, setConfirmationCallback] = useState<
    (reason: string) => void
  >(() => () => {});

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
      console.error(error);
      toast.error("Failed to fetch appointments");
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor) fetchAppointments();
  }, [doctor, fetchAppointments]);

  const showConfirmationModal = (
    message: string,
    onConfirm: (reason: string) => void
  ) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

  const handleCancel = async (id: string) => {
    showConfirmationModal(
      "Do you want to cancel this appointment?",
      async (reason: string) => {
        try {
          const response = await api.put(
            `/doctor/appointments/cancel/${id}`,
            { role: "Appointments", reason },
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
          console.error(error);
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

  const handleView = (appointmentId: string, status: string) => {
    if (status === "consulted") {
      navigate("/doctor/medicalrecord", { state: { appointmentId } });
    } else {
      navigate("/doctor/appointment", { state: { appointmentId } });
    }
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center md:p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <DoctorTopBar />
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl mt-5 shadow-lg rounded-lg bg-[#007E85]">
            <h2 className="text-2xl font-bold mb-4 text-white p-4 border-b">
              Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#007E85] border border-collapse">
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
                            <button
                              className="bg-blue-500 rounded-xl px-2 py-1 border-[1px] mr-2"
                              onClick={() =>
                                handleView(appointment._id, appointment.status)
                              }
                            >
                              View
                            </button>
                            {appointment.status === "pending" && (
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
            </div>
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
      <CancelModal
        showModal={isConfirmModalOpen}
        message={message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={(reason: string) => {
          if (confirmationCallback) confirmationCallback(reason);
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
};

export default DoctorAppointments;
