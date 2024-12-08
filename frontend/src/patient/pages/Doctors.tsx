import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { IDoctor } from "./../../../../server/src/models/doctorModel";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  console.log("doctors", doctors);

  const fetchDoctors = async () => {
    try {
      const doctorsData = await axios.get(
        "http://localhost:8080/api/patients/doctors",
        {
          headers: {
            "Content-Type": "application/Json",
          },
          withCredentials: true,
        }
      );
      if (doctorsData.data) {
        console.log(doctorsData.data);
        setDoctors(doctorsData.data.doctors);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error in fetching data", error);
    }
  };

  return (
    <div>
      <Navbar />
      {doctors.map((doctor: IDoctor) => (
        <div className=" flex gap-5 border-[2px] border-[#007E85] h-40 w-[40rem] ml-5 rounded-lg">
          <img
            src=""
            alt=""
            className="rounded-full border-[2px] border-[#007E85] h-[80%] w-[20%] mt-3 ml-2"
          />
          <div className="bg-red-100 h-full w-56">
            <h1 className="text-[#007E85] font-extrabold">
              DR. {doctor.firstName.toUpperCase()}{" "}
              {doctor.lastName.toUpperCase()}
            </h1>
            <p>{doctor.specialization} </p>
            <p>{doctor.experience} years experience</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Doctors;
