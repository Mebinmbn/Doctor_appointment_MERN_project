import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/admin/AdminNav";
import { toast } from "react-toastify";
import { IDoctor } from "../../../../server/src/models/doctorModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import EditDoctorModel from "../../components/admin/EditDoctorModel";
import { clearAdmin } from "../../app/featrue/adminSlice";
import api from "../../api/api";
import AdminTopBar from "../../components/admin/AdminTopBar";
import ConfirmationModal from "../../components/confirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<IDoctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => () => {}
  );
  const dispatch = useDispatch();

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await api.get(
        `/admin/doctors?page=${currentPage}&limit=7&search=${searchQuery}&specialization=${specialization}&gender=${gender}&experience=${experience}`,
        { headers: { "User-Type": "admin" } }
      );
      if (response.data.success) {
        setIsLoading(false);
        setDoctors(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      dispatch(clearAdmin());
    }
  }, [currentPage, searchQuery, specialization, gender, experience, dispatch]);

  useEffect(() => {
    fetchDoctors();
    setIsLoading(true);
  }, [fetchDoctors]);

  const clearFilter = () => {
    setSearchQuery("");
    setSpecialization("");
    setGender("");
    setExperience("");
    setCurrentPage(1);
  };
  const openModal = (index: number) => {
    setIsEditModalOpen(true);
    setDoctorToEdit(doctors[index]);
  };
  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
    setDoctorToEdit(null);
    fetchDoctors();
  }, [fetchDoctors]);
  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };
  const handleStatusUpdate = async (id: string | null, status: boolean) => {
    showConfirmationModal(
      `Do you want to ${status ? "block" : "unblock"} this doctor?`,
      async () => {
        try {
          const response = await api.put(
            `/admin/doctors/update/${id}`,
            { role: "doctor", status: status },
            { headers: { "User-Type": "admin" } }
          );
          if (response.data.success) {
            fetchDoctors();
            toast.success(
              `Doctor ${status ? "blocked" : "unblocked"} successfully`
            );
          }
        } catch (error) {
          console.error(
            `Error in ${status ? "blocking" : "unblocking"} doctor:`,
            error
          );
          toast.error(`Error in ${status ? "blocking" : "unblocking"}`);
        }
        setIsConfirmModalOpen(false);
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <Navbar />
      <div className="bg-white h-fit min-h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <AdminTopBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl mt-1 shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-1 text-white p-4 text-white border-b text-white">
                Doctors
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 text-gray-800 m-2 h-10 rounded-lg w-80 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Find doctor"
              />
              <select
                id="specialization"
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="bg-white text-gray-800 m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
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
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-white text-gray-800 m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
              >
                <option value="">Gender</option>{" "}
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select
                id="experience"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-white text-gray-800 m-2 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
              >
                <option value="">Experience</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
                <option value="15">15+ years</option>
                <option value="20">20+ years</option>
              </select>
              <button
                onClick={clearFilter}
                className="bg-white text-gray-500 m-2 px-3 py-2 border border-[#007E85] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
              >
                Clear Filters
              </button>
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
                  {doctors.map((doctor: IDoctor, index) => (
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
                            onClick={() => openModal(index)}
                          >
                            Edit
                          </button>
                          {doctor.isBlocked ? (
                            <button
                              className="bg-red-500 w-18 rounded-xl p-1 border-[1px]"
                              onClick={() =>
                                handleStatusUpdate(doctor._id as string, false)
                              }
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                              onClick={() =>
                                handleStatusUpdate(doctor._id as string, true)
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
        <EditDoctorModel
          isOpen={isEditModalOpen}
          onRequestClose={closeModal}
          doctor={doctorToEdit}
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
};

export default React.memo(AllDoctors);
