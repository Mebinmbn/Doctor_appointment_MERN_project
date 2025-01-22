import { useEffect, useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import api from "../../api/api";
import { Appointment } from "../../types/appointment";
import { endOfDay, startOfDay } from "date-fns";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good Morning");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaysApointments, setTodaysAppointments] = useState<Appointment[]>(
    []
  );
  const [earnings, setEarnings] = useState(0);

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
        const today = startOfDay(new Date());
        const tomorrow = endOfDay(today);

        console.log("today", today, " tomorrow", tomorrow);
        const todaysAppointments = [];
        for (const appointment of response.data.appointments) {
          console.log(appointment.date);
          if (
            new Date(appointment.date) >= today &&
            new Date(appointment.date) <= tomorrow
          ) {
            todaysAppointments.push(appointment);
          }
        }
        setTodaysAppointments(todaysAppointments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/doctor/payments/${doctor?.id}`, {
        headers: { "User-Type": "doctor" },
      });
      if (response.data.success) {
        let totalPayments = 0;
        for (const payment of response.data.payments) {
          totalPayments += parseInt(payment.amount) - 100;
        }
        setEarnings(totalPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPayments();
  }, []);

  // console.log("payments", payments);

  return (
    <div className="md:flex items-center p-2 justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />

      <div className="bg-gray-200 h-fit min-h-[98vh] w-full md:w-[86vw] text-center p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <DoctorTopBar />
        <div className="p-5  min-h-fit flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-lg md:text-3xl text-left font-bold text-gray-800">
              {greeting}
              <span className="text-teal-600 text-xl md:text-5xl">
                {" "}
                Dr. {doctor?.name}
              </span>
            </h1>
          </div>

          <div className="w-full max-w-4xl bg-gradient-to-tr from-white to-[#007E85] rounded-lg shadow-lg p-8 flex items-center mt-4">
            <div className="flex-1">
              <h2 className=" text-lg ">Visits for Today</h2>
              <p className="text-8xl font-bold animated-number">
                {todaysApointments.length}
              </p>
            </div>
          </div>
          <div className="bottom-container flex justify-between gap-5 w-full max-w-4xl">
            {/* <div className="w-full "> */}
            <div className="h-full min-h-72 w-full  mt-5 bg-white rounded-lg shadow-lg p-6 ">
              <h2 className="text-lg font-bold text-gray-800">Patient List</h2>
              <div className="overflow-auto  h-52 px-2 hide-scrollbar">
                <ul className="mt-4">
                  {todaysApointments.length <= 0 && (
                    <p className="text-red-500">No appointments for today</p>
                  )}

                  {todaysApointments.map((patient, index) => (
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
            {/* </div> */}
            {/* <div className="w-full "> */}
            <div className="h-full min-h-72 w-full  mt-5 bg-white rounded-lg shadow-lg p-6 ">
              <div className="w-full bg-gradient-to-tr from-gray-100 to-blue-100  border-b-4 border-green-100 min-h-28 rounded-lg p-5">
                <h1 className="text-xl  text-[#007E85] font-bold">Earnings</h1>
                <strong className="text-4xl ">₹{earnings}</strong>
              </div>
              <div className="w-full bg-gradient-to-tr from-gray-100 to-pink-100 border-b-4 border-green-100 min-h-28 mt-3 rounded-lg p-5">
                <h1 className="text-xl  text-[#007E85] font-bold">
                  Appointments
                </h1>
                <strong className="text-4xl ">{appointments.length}</strong>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
