import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import DoctorNav from "../components/DoctorNav";
import { Appointment } from "../../types/appointment";
import DoctorTopBar from "../components/DoctorTopBar";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  useEffect(() => {
    if (!doctor) {
      navigate("/doctorSignin");
      toast.warn("Login to continue");
    }
  });
  console.log("doctor", doctor);
  const token = localStorage.getItem("doctorToken");

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/appointments/${doctor?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("response", response.data);
      if (response.data) {
        setAppointments(response.data.appointments);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
    console.log("Appointments", appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAppointments]);

  const handleReject = async (id: string) => {
    try {
      const resposnse = await axios.put(
        `http://localhost:8080/api/doctor/appointments/reject/${id}`,
        { role: "Appointments" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchAppointments();
        toast.success("Appointment Rejected");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in approval");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const resposnse = await axios.put(
        `http://localhost:8080/api/doctor/appointments/approve/${id}`,
        { role: "Appointments" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchAppointments();
        toast.success("Appointment Approved");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in approval");
    }
  };

  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexofFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments?.slice(
    indexofFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
        <DoctorNav />
        <div className="bg-white h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
          <DoctorTopBar />
          <div className="flex justify-center  items-center ">
            <div className="w-full max-w-6xl mt-5  shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-4 text-white p-4 text-white border-b text-white">
                Appointments
              </h2>
              <table className="min-w-full bg-[#007E85] border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-white border-b">Patient</th>

                    <th className="py-2 px-4 text-white border-b">Date</th>
                    <th className="py-2 px-4 text-white border-b">Timet</th>

                    <th className="py-2 px-4 text-white border-b">Payment</th>
                    <th className="py-2 px-4 text-white border-b">Status</th>

                    <th className="py-2 px-4 text-white border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.length ? (
                    <>
                      {currentAppointments?.map((appointment: Appointment) => (
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
                            {appointment.status === "confirmed" ? (
                              <div>
                                <button
                                  className="bg-blue-500 rounded-xl py-1 px-5 border-[1px] mr-2"
                                  onClick={() => {
                                    // handleApprove(appointment._id);
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            ) : (
                              <div>
                                <button
                                  className="bg-green-500 rounded-xl p-1 border-[1px] mr-2"
                                  onClick={() => {
                                    handleApprove(appointment._id);
                                  }}
                                >
                                  Approve
                                </button>

                                <button
                                  className="bg-red-500 w-20 rounded-xl p-1 border-[1px]"
                                  onClick={() => {
                                    handleReject(appointment._id);
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr className="text-center">
                      <p className="text-center">No appointments found </p>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-center mt-4 ">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 mb-1 ${
                        currentPage === page
                          ? "bg-blue-500 text-white rounded-full"
                          : " text-black"
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
    </div>
  );
}

export default DoctorAppointments;
