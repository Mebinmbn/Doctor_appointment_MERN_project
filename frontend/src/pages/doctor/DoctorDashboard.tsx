import { useEffect, useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";
import { Appointment } from "../../types/appointment";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good Morning");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!doctor) {
      navigate("/doctor/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [doctor, navigate]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/doctor/dashboard/${doctor?.id}`, {
        headers: { "User-Type": "doctor" },
      });
      if (response.data.appointments) {
        setAppointments(response.data.appointments);
        console.log(response.data.appointments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="md:flex items-center p-2 justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />

      <div className="bg-gray-200 h-fit min-h-[98vh] w-full md:w-[86vw] text-center p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <DoctorTopBar />
        <div className="p-5  min-h-fit flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl text-left font-bold text-gray-800">
              {greeting}
              <span className="text-teal-600 text-5xl">
                {" "}
                Dr. {doctor?.name}
              </span>
            </h1>
          </div>

          <div className="w-full max-w-4xl bg-gradient-to-tr from-white to-[#007E85] rounded-lg shadow-lg p-10 flex items-center mt-4">
            <div className="flex-1">
              <h2 className=" text-lg ">Visits for Today</h2>
              <p className="text-8xl font-bold animated-number">
                {appointments.length}
              </p>
            </div>
          </div>
          <div className="w-full max-w-4xl">
            <div className="h-full w-full max-w-sm mt-5 bg-white rounded-lg shadow-lg p-6 ">
              <h2 className="text-lg font-bold text-gray-800">Patient List</h2>
              <div className="overflow-auto  h-52 px-2 hide-scrollbar">
                <ul className="mt-4">
                  {appointments.length <= 0 && (
                    <p className="text-red-500">No appointments for today</p>
                  )}

                  {appointments.map((patient, index) => (
                    <li
                      key={index}
                      className="flex border-b pb-4 last:border-none"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-gray-800 font-semibold">
                          {patient.patientId.firstName}{" "}
                          {patient.patientId.lastName}
                        </p>
                      </div>
                      <p className="text-pink-400 font-semibold">
                        {patient.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
