import { useCallback, useEffect, useState } from "react";
import AdminNav from "../../components/admin/AdminNav";
import { Doctor } from "../../types/doctor";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import EditDoctorModel from "../../components/admin/EditDoctorModel";
import { clearAdmin } from "../../app/featrue/adminSlice";
import api from "../../api/api";

function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const dispatch = useDispatch();

  const admin = useSelector((state: RootState) => state.admin.admin);

  const navigate = useNavigate();
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [navigate, admin]);

  const fetchDoctors = useCallback(async () => {
    try {
      const applicationResponse = await api.get("/admin/doctors", {
        headers: {
          "User-Type": "admin",
        },
      });

      console.log("applicationResponse", applicationResponse.data);
      if (applicationResponse.data) {
        setDoctors(applicationResponse.data.doctors);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.response.data.message);
      if (error.response.data.message) {
        dispatch(clearAdmin());
      }
    }
  }, [dispatch]);

  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const openModal = (index: number) => {
    setIsEditModalOpen(true);
    setDoctorToEdit(doctors[index]);
  };
  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
    setDoctorToEdit(null);
    fetchDoctors();
  }, [fetchDoctors]);

  const handleUnblock = async (id: string) => {
    try {
      const resposnse = await api.post(
        `/admin/doctors/unblock/${id}`,
        { role: "doctor" },
        {
          headers: {
            "User-Type": "admin",
          },
        }
      );
      if (resposnse.data.success) {
        fetchDoctors();
        toast.success("Doctor unblocked");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in unblocking");
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const resposnse = await api.post(
        `/admin/doctors/block/${id}`,
        { role: "doctor" },
        {
          headers: {
            "User-Type": "admin",
          },
        }
      );
      if (resposnse.data.success) {
        fetchDoctors();
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
            {/* <input
              type="text"
              placeholder="Search"
              className="rounded-lg h-10 w-[50%] back bg-gray-200 border-[1px] ml-5 p-3"
            /> */}
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
                  {currentDoctors?.map((doctor: Doctor, index) => (
                    <tr key={index}>
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
                            onClick={() => {
                              openModal(index);
                            }}
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
      {isEditModalOpen && (
        <EditDoctorModel
          isOpen={isEditModalOpen}
          onRequestClose={closeModal}
          doctor={doctorToEdit}
        />
      )}
    </div>
  );
}

export default AllDoctors;
