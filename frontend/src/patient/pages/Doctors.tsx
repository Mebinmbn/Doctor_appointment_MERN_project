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
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([]);

  const user = useSelector((state: RootState) => state.auth.user) as
    | string
    | null;
  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
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

  const clearFilter = () => {
    setSpecialization("");
    setGender("");
    setExperience("");
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = doctors.filter((doctor: IDoctor) => {
        const matchesSearch =
          searchQuery === "" ||
          `${doctor.firstName} ${doctor.lastName}`
            .toLowerCase()
            .includes(searchQuery);
        const matchesSpecialization =
          specialization === "" ||
          doctor.specialization.toLowerCase() === specialization;
        const matchesGender =
          gender === "" || doctor.gender.toLowerCase() === gender;
        const matchesExperience =
          experience === "" ||
          parseInt(doctor.experience, 10) >= parseInt(experience, 10);

        return (
          matchesSearch &&
          matchesSpecialization &&
          matchesGender &&
          matchesExperience
        );
      });
      setFilteredDoctors(filtered);
    };

    applyFilters();
  }, [searchQuery, specialization, gender, experience, doctors]);

  return (
    <div>
      <Navbar />

      <div className="w-full bg-blue-900 mt-5 p-4">
        <div className="flex flex-col lg:flex-row justify-evenly">
          <div className="form-group flex-1 lg:flex-none">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 m-2 h-10 rounded-lg w-full lg:w-80 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Find doctor"
            />
          </div>
          <div className="form-group flex-1 lg:flex-none">
            <select
              id="specialization"
              name="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="bg-white m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
            >
              <option value="">Specialization</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="dermatologist">Dermatologist</option>
              <option value="dentist">Dentist</option>
              <option value="gynecologist">Gynecologist</option>
              <option value="pediatrician">Pediatrician</option>
              <option value="psychiatrist">Psychiatrist</option>
              <option value="oncologist">Oncologist</option>
              <option value="neurologist">Neurologist</option>
            </select>
          </div>
          <div className="form-group flex-1 lg:flex-none">
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-white m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group flex-1 lg:flex-none">
            <select
              id="experience"
              name="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="bg-white m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
            >
              <option value="">Experience</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
              <option value="15">15+ years</option>
              <option value="20">20+ years</option>
            </select>
          </div>
          <button
            onClick={() => clearFilter()}
            className="bg-white m-2 px-3 py-2 border border-[#007E85]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* <div className="bg-blue-300 w-full h-3 my-5"></div> */}
      <div className="flex w-90 flex-wrap justify-center gap-5 ml-auto p-5 border-8">
        {filteredDoctors.map((doctor: IDoctor) => (
          <div className="  gap-5 border-[2px] border-[#007E85] h-fit w-[15rem]  my-4 rounded-lg p-5">
            <img
              src={doctorIcon}
              alt=""
              className="rounded-full border-[2px] border-[#007E85] h-[90%] w-[40%] mt-2 mx-auto object-cover"
            />
            <div className=" h-full w-full  text-center">
              <h1 className="text-[#007E85] font-extrabold my-4">
                DR. {doctor.firstName.toUpperCase()}
                <span> {doctor.lastName.toUpperCase()}</span>
              </h1>
              <p className="font-bold">{doctor.specialization.toUpperCase()}</p>
              <p>{doctor.location} </p>
              <p>{doctor.experience} years experience</p>
              <p>
                ₹ {doctor.fees}
                <span className="text-red-500"> Consultation Fees</span>
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
