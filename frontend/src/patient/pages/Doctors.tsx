import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { IDoctor } from "./../../../../server/src/models/doctorModel";
import doctorIcon from "../../assets/icon/doctor.png";
import { useSelector } from "react-redux";

import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const user = useSelector((state: RootState) => state.auth.user) as
    | string
    | null;
  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.info("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDoctors();
  }, [user]);

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
      <div className="flex flex-wrap justify-evenly ml-auto p-5">
        {doctors.map((doctor: IDoctor) => (
          <div className="  gap-5 border-[2px] border-[#007E85] h-fit w-[15rem]  my-4 rounded-lg p-5">
            <img
              src={doctorIcon}
              alt=""
              className="rounded-full border-[2px] border-[#007E85] h-[90%] w-[40%] mt-2 mx-auto object-cover"
            />
            <div className=" h-full w-full  text-center">
              <h1 className="text-[#007E85] font-extrabold my-4">
                DR. {doctor.firstName.toUpperCase()}
                {doctor.lastName.toUpperCase()}
              </h1>
              <p className="font-bold">{doctor.specialization.toUpperCase()}</p>
              <p>{doctor.location} </p>
              <p>{doctor.experience} years experience</p>
              <p>
                ₹ {doctor.fees}
                <span className="text-red-500">Consultation Fees</span>
              </p>
              <button className="bg-[#007E85] rounded-lg px-2 py-1 m-3 text-white w-fit font-bold">
                Get An Appointmet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Doctors);
