import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import axios from "axios";
import { Doctor } from "../../types/doctor";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

function AllDoctors() {
  const [doctorApplications, setDoctorApplications] = useState([]);

  const admin = useSelector((state: RootState) => state.admin.admin);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!admin || !token) {
      navigate("/adminSignin");
    }
  });

  useEffect(() => {
    fetchDoctorApplications();
  }, []);
  console.log(doctorApplications);

  const fetchDoctorApplications = async () => {
    try {
      const applicationResponse = await axios.get(
        "http://localhost:8080/api/admin/doctors",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("applicationResponse", applicationResponse.data);
      if (applicationResponse.data) {
        setDoctorApplications(applicationResponse.data.doctors);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/doctors/unblock/${id}`,
        { role: "doctor" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchDoctorApplications();
        toast.success("Doctor unblocked");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in unblocking");
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/doctors/block/${id}`,
        { role: "doctor" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchDoctorApplications();
        toast.success("Doctor blocked successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in blocking");
    }
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
            <div className="bg-gray-100 rounded-xl w-20 p-2 ml-auto ">
              <p className="text-black font-bold">Admin</p>
            </div>
          </div>
          <div className="flex justify-center  items-center ">
            <div className="w-full max-w-6xl mt-5  shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-4 text-white p-4 text-white border-b text-white">
                Doctors
              </h2>
              <table className="min-w-full bg-[#007E85] border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-white border-b">Name</th>

                    <th className="py-2 px-4 text-white border-b">Email</th>

                    <th className="py-2 px-4 text-white border-b">
                      Specialization
                    </th>
                    <th className="py-2 px-4 text-white border-b">
                      Experience
                    </th>
                    <th className="py-2 px-4 text-white border-b">Location</th>
                    <th className="py-2 px-4 text-white border-b">Gender</th>
                    <th className="py-2 px-4 text-white border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorApplications?.map((doctor: Doctor) => (
                    <tr key={doctor._id}>
                      <td className="py-2 px-4 text-white border-b">
                        {doctor.firstName} {doctor.lastName}
                      </td>

                      <td className="py-2 px-4 text-white border-b">
                        {doctor.email}
                      </td>

                      <td className="py-2 px-4 text-white border-b">
                        {doctor.specialization}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {doctor.experience} years
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {doctor.location}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {doctor.gender}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        <div>
                          <button
                            className="bg-green-500 rounded-xl p-1 border-[1px] mr-2"
                            onClick={() => {}}
                          >
                            Edit
                          </button>
                          {doctor.isBlocked ? (
                            <button
                              className="bg-red-500 w-18 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                handleUnblock(doctor._id);
                              }}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                handleBlock(doctor._id);
                              }}
                            >
                              Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllDoctors;
