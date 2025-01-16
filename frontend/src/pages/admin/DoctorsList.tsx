import { useEffect, useState } from "react";
import AdminNav from "../../components/admin/AdminNav";
import { Doctor } from "../../types/doctor";
import ImageModal from "../../components/admin/ImageModal";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AdminTopBar from "../../components/admin/AdminTopBar";
import ConfirmationModal from "../../components/ConfirmationModal";

function DoctorsList() {
  const [doctorApplications, setDoctorApplications] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationCallback, setConfirmationCallback] = useState<() => void>(
    () => {}
  );
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);
  useEffect(() => {
    fetchDoctorApplications();
  }, []);
  console.log(doctorApplications);
  const fetchDoctorApplications = async () => {
    try {
      const applicationResponse = await api.get("/admin/applications", {
        headers: { "User-Type": "admin" },
        withCredentials: true,
      });
      console.log("applicationResponse", applicationResponse.data);
      if (applicationResponse.data) {
        setDoctorApplications(applicationResponse.data.applications);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const showConfirmationModal = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setIsConfirmModalOpen(true);
    setConfirmationCallback(() => onConfirm);
  };
  const handleApprove = (id: string) => {
    showConfirmationModal("Do you want to confirm the approval?", async () => {
      try {
        const response = await api.post(
          `/admin/applications/approve/${id}`,
          {},
          { headers: { "User-Type": "admin" } }
        );
        if (response.data.success) {
          fetchDoctorApplications();
          toast.success("Application approved");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error in approval");
      }
    });
  };
  const handleReject = (email: string) => {
    showConfirmationModal("Do you want to confirm the rejection?", async () => {
      try {
        const response = await api.post(`/admin/applications/reject/${email}`, {
          headers: { "User-Type": "admin" },
        });
        if (response.data.success) {
          fetchDoctorApplications();
          toast.success("Application Rejected");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error in rejection");
      }
    });
  };

  const indexOfLastDoctorApplications = currentPage * itemsPerPage;
  const indexOfFirstDoctorApplications =
    indexOfLastDoctorApplications - itemsPerPage;
  const currentDoctorApplications = doctorApplications.slice(
    indexOfFirstDoctorApplications,
    indexOfLastDoctorApplications
  );
  const totalPages = Math.ceil(doctorApplications.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
        <AdminNav />
        <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center md:px-6 py-5 text-white md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
          <AdminTopBar />
          <div className="flex justify-center  items-center ">
            <div className="w-full max-w-6xl mt-5  shadow-lg rounded-lg bg-[#007E85]">
              <h2 className="text-2xl font-bold mb-4 text-white p-4 text-white border-b text-white">
                Applications
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#007E85] border border-collapse">
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
                      <th className="py-2 px-4 text-white border-b">
                        Location
                      </th>
                      <th className="py-2 px-4 text-white border-b">License</th>
                      <th className="py-2 px-4 text-white border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDoctorApplications?.map((doctor: Doctor) => (
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
                          <img
                            src={`https://befine.site/uploads/license/${doctor.licenseImage.path
                              .split("\\")
                              .pop()}`}
                            alt={doctor.licenseImage.path.split("/").pop()}
                            className="h-16 w-16 object-cover rounded"
                            onClick={() =>
                              openModal(
                                `https://befine.site/uploads/license/${doctor.licenseImage.path
                                  .split("\\")
                                  .pop()}`
                              )
                            }
                          />
                          {doctor.licenseImage.path.split("\\").pop()}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          <div>
                            <button
                              className="bg-green-500 rounded-xl p-1 border-[1px] mr-2"
                              onClick={() => {
                                handleApprove(doctor.email);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 w-16 rounded-xl p-1 border-[1px]"
                              onClick={() => {
                                handleReject(doctor.email);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      <ImageModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        imageUrl={selectedImage || ""}
      />
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

export default DoctorsList;
