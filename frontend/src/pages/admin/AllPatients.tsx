import { useCallback, useEffect, useState } from "react";
import AdminNav from "../../components/admin/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import EditPatientModal from "../../components/admin/EditPatientModal";
import { User } from "../../types/user";
import api from "../../api/api";

function AllPatients() {
  const [patients, setPatients] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await api.get(
        `/admin/patients?page=${currentPage}&limit=7&search=${searchQuery}`,
        {
          headers: {
            "User-Type": "admin",
          },
        }
      );

      if (response.data.success) {
        setPatients(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients, admin]);

  const clearFilter = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const openModal = (index: number) => {
    setIsEditModalOpen(true);
    setPatientToEdit(patients[index]);
  };

  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
    setPatientToEdit(null);
    fetchPatients();
  }, [fetchPatients]);

  const handleUnblock = async (id: string) => {
    try {
      const response = await api.post(
        `/admin/patients/unblock/${id}`,
        { role: "patients" },
        {
          headers: {
            "User-Type": "admin",
          },
        }
      );
      if (response.data.success) {
        fetchPatients();
        toast.success("Patient unblocked");
      }
    } catch (error) {
      console.error("Error in unblocking patient:", error);
      toast.error("Error in unblocking");
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const response = await api.post(
        `/admin/patients/block/${id}`,
        { role: "patients" },
        {
          headers: {
            "User-Type": "admin",
          },
        }
      );
      if (response.data.success) {
        fetchPatients();
        toast.success("Patient blocked successfully");
      }
    } catch (error) {
      console.error("Error in blocking patient:", error);
      toast.error("Error in blocking");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <AdminNav />
      <div className="bg-white h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <div className="flex justify-evenly m-5 w-[90%] mx-auto">
          <div className="bg-gray-100 rounded-xl w-20 p-2 ml-auto ">
            <p className="text-black font-bold">Admin</p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl  shadow-lg rounded-lg bg-[#007E85]">
            <h2 className="text-2xl font-bold mb-1 text-white p-4 text-white border-b text-white">
              Patients
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 text-gray-800 m-2 h-10 rounded-lg w-80 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Find patient"
            />
            <button
              onClick={clearFilter}
              className="bg-white text-gray-800 m-2 px-3 py-2 border border-[#007E85]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
            >
              Clear Search
            </button>
            <table className="min-w-full bg-[#007E85] border">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-white border-b">First Name</th>
                  <th className="py-2 px-4 text-white border-b">Last Name</th>
                  <th className="py-2 px-4 text-white border-b">Email</th>
                  <th className="py-2 px-4 text-white border-b">Phone</th>
                  <th className="py-2 px-4 text-white border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
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
                          onClick={() => openModal(index)}
                        >
                          Edit
                        </button>
                        {patient.isBlocked ? (
                          <button
                            className="bg-red-500 w-18 rounded-xl p-1 border-[1px]"
                            onClick={() => handleUnblock(patient._id)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                            onClick={() => handleBlock(patient._id)}
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
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 mb-1 ${
                      currentPage === page
                        ? "bg-blue-500 text-white rounded-full"
                        : "text-black"
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
