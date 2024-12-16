import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

import { Appointment } from "../../types/appointment";
import AdminNav from "../components/AdminNav";
function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  useEffect(() => {
    if (!admin) {
      navigate("/adminSignin");
    }
  });

  const token = localStorage.getItem("adminToken");

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/appointments`,
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
  }, [fetchAppointments]);

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
        <AdminNav />
        <div className="bg-white h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
          <div className="flex justify-evenly m-5 w-[90%]  mx-auto">
            <input
              type="text"
              placeholder="Search"
              className="rounded-lg h-10 w-[50%] back bg-gray-200 border-[1px] ml-5 p-3"
            />
            <div className="bg-gray-100 rounded-xl w-fit  p-2 ml-auto ">
              <p className="text-black font-bold">Admin</p>
            </div>
          </div>
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
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.length ? (
                    <>
                      {currentAppointments?.map((appointment: Appointment) => (
                        <tr key={appointment._id}>
                          <td className="py-2 px-4 text-white border-b">
                            {appointment.patientId.firstName}
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

export default AdminAppointments;
