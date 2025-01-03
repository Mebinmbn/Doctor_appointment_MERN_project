import { useEffect, useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";
import doctorIcon from "../../assets/icon/doctor.png";

function DoctorDashboard() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good Morning");

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

  const patients = [
    {
      initials: "SM",
      name: "Anuradha",
      visitType: "Weekly Visit",
      time: "9:15 AM",
    },
    {
      initials: "AD",
      name: "Anu",
      visitType: "Routine Checkup",
      time: "9:30 AM",
    },
    { initials: "DJ", name: "Jery", visitType: "Report", time: "9:50 AM" },
    {
      initials: "SM",
      name: "Rohan",
      visitType: "Weekly Visit",
      time: "10:15 AM",
    },
    {
      initials: "SM",
      name: "Rohan",
      visitType: "Weekly Visit",
      time: "10:15 AM",
    },
    {
      initials: "SM",
      name: "Rohan",
      visitType: "Weekly Visit",
      time: "10:15 AM",
    },
    {
      initials: "SM",
      name: "Rohan",
      visitType: "Weekly Visit",
      time: "10:15 AM",
    },
    {
      initials: "SM",
      name: "Rohan",
      visitType: "Weekly Visit",
      time: "10:15 AM",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <DoctorNav />

      <div className="bg-gray-200 h-[98vh] w-[86vw] text-center p-4 rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <DoctorTopBar />
        <div className="p-5  min-h-screen flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl text-left font-bold text-gray-800">
              {greeting}
              <span className="text-teal-600 text-5xl">
                {" "}
                Dr. {doctor?.name}
              </span>
            </h1>
          </div>

          <div className="w-full max-w-4xl bg-gradient-to-tr from-white to-[#007E85] rounded-lg shadow-lg p-10 flex items-center mt-2">
            <div className="flex-1">
              <h2 className=" text-lg ">Visits for Today</h2>
              <p className="text-8xl font-bold  ">5</p>
            </div>
            {/* <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={doctorIcon}
                alt="Doctor Avatar"
                className="w-full h-full object-cover"
              />
            </div> */}
          </div>
          <div className="w-full max-w-4xl">
            <div className="h-full w-full max-w-sm mt-5 bg-white rounded-lg shadow-lg p-6 ">
              <h2 className="text-lg font-bold text-gray-800">Patient List</h2>
              <div className="overflow-auto  h-52 px-2 hide-scrollbar">
                <ul className="mt-4">
                  {patients.map((patient, index) => (
                    <li
                      key={index}
                      className="flex border-b pb-4 last:border-none"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-gray-800 font-semibold">
                          {patient.name}
                        </p>
                      </div>
                      <p className="text-teal-600 font-semibold">
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
