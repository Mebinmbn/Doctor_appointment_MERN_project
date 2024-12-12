import { useCallback, useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import EditPatientModal from "../components/EditPatientModal";
import { User } from "./../../types/user";

function AllPatients() {
  const [patients, setPaitents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<User | null>(null);
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

  const fetchPatients = useCallback(async () => {
    try {
      const applicationResponse = await axios.get(
        "http://localhost:8080/api/admin/patients",
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
        setPaitents(applicationResponse.data.patients);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchPatients();
    console.log(patients);
  }, [fetchPatients]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (index: any) => {
    setIsEditModalOpen(true);
    setPatientToEdit(patients[index]);
  };
  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
    setPatientToEdit(null);
    fetchPatients();
  }, []);

  const handleUnblock = async (id: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/patients/unblock/${id}`,
        { role: "patients" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchPatients();
        toast.success("patients unblocked");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in unblocking");
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/patients/block/${id}`,
        { role: "patients" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (resposnse.data.success) {
        fetchPatients();
        toast.success("patients blocked successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in blocking");
    }
  };

  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexofFirstPatient = indexOfLastPatient - itemsPerPage;
  const currentPatients = patients.slice(
    indexofFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(patients.length / itemsPerPage);

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
            <div className="bg-gray-100 rounded-xl w-20 p-2 ml-auto ">
              <p className="text-black font-bold">Admin</p>
            </div>
          </div>
          <div className="flex justify-center  items-center ">
            <div className="w-full max-w-6xl mt-5  shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-4 text-white p-4 text-white border-b text-white">
                Patients
              </h2>
              <table className="min-w-full bg-[#007E85] border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-white border-b">
                      First Name
                    </th>

                    <th className="py-2 px-4 text-white border-b">Last Name</th>

                    <th className="py-2 px-4 text-white border-b">Email</th>
                    <th className="py-2 px-4 text-white border-b">
                      Experience
                    </th>

                    <th className="py-2 px-4 text-white border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients?.map((patient: User, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 text-white border-b">
                        {patient.firstName}
                      </td>

                      <td className="py-2 px-4 text-white border-b">
                        {patient.lastName}
                      </td>

                      <td className="py-2 px-4 text-white border-b">
                        {patient.email}
                      </td>
                      <td className="py-2 px-4 text-white border-b">
                        {patient.phone}
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
                          {patient.isBlocked ? (
                            <button
                              className="bg-red-500 w-18 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                handleUnblock(patient._id);
                              }}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                handleBlock(patient._id);
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
        <EditPatientModal
          isOpen={isEditModalOpen}
          onRequestClose={closeModal}
          patient={patientToEdit}
        />
      )}
    </div>
  );
}

export default AllPatients;
