import { useCallback, useEffect, useState } from "react";
import AdminNav from "../../components/admin/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import EditPatientModal from "../../components/admin/EditPatientModal";

import { User } from "../../types/user";
import api from "../../api/api";
import AdminTopBar from "../../components/admin/AdminTopBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";

function AllPatients() {
  const [patients, setPatients] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );

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
        setIsLoading(false);
        setPatients(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchPatients();
    setIsLoading(true);
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

  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    showConfirmationModal(
      `Do you want to ${status ? "block" : "unblock"} this patient?`,
      async () => {
        try {
          const response = await api.put(
            `/admin/patients/update/${id}`,
            { role: "patients", status },
            {
              headers: {
                "User-Type": "admin",
              },
            }
          );
          if (response.data.success) {
            fetchPatients();
            toast.success(
              `Patient ${status ? "blocked" : "unblocked"} successfully`
            );
          }
        } catch (error) {
          console.error(
            `Error in ${status ? "blocking" : "unblocking"} patient:`,
            error
          );
          toast.error(`Error in ${status ? "blocking" : "unblocking"}`);
        }
        setIsConfirmModalOpen(false);
      }
    );
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <AdminNav />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center md:px-6 py-5 text-white md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <AdminTopBar />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-1 text-white p-4 border-b">
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
                className="bg-white text-gray-800 m-2 px-3 py-2 border border-[#007E85] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-32"
              >
                Clear Search
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#007E85] border border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-white border-b">
                        First Name
                      </th>
                      <th className="py-2 px-4 text-white border-b">
                        Last Name
                      </th>
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
                                onClick={() =>
                                  handleUpdateStatus(patient._id, false)
                                }
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                                onClick={() =>
                                  handleUpdateStatus(patient._id, true)
                                }
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
        )}
      </div>
      {isEditModalOpen && (
        <EditPatientModal
          isOpen={isEditModalOpen}
          onRequestClose={closeModal}
          patient={patientToEdit}
        />
      )}
      <ConfirmationModal
        showModal={isConfirmModalOpen}
        message={message}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          if (confirmationCallback) confirmationCallback();
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
}

export default AllPatients;
