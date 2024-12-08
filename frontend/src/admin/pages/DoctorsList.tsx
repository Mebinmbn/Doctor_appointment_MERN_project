import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import axios from "axios";
import { Doctor } from "../../types/doctor";
import ImageModal from "../components/ImageModal";
import { toast } from "react-toastify";

function DoctorsList() {
  const [doctorApplications, setDoctorApplications] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDoctorApplications();
  }, []);
  console.log(doctorApplications);
  const fetchDoctorApplications = async () => {
    try {
      const applicationResponse = await axios.get(
        "http://localhost:8080/api/admin/applications",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("applicationResponse", applicationResponse.data);
      if (applicationResponse.data) {
        setDoctorApplications(applicationResponse.data.applications);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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

  const handleApprove = async (id: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/applications/approve/${id}`
      );
      if (resposnse.data.success) {
        fetchDoctorApplications();
        toast.success("Application approved");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in approval");
    }
  };

  const handleReject = async (email: string) => {
    try {
      const resposnse = await axios.post(
        `http://localhost:8080/api/admin/applications/reject/${email}`
      );
      if (resposnse.data.success) {
        fetchDoctorApplications();
        toast.success("Application Rejected");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in approval");
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
                Doctors List
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
                    <th className="py-2 px-4 text-white border-b">License</th>
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
                        <img
                          src={`http://localhost:8080/uploads/license/${doctor.licenseImage.path
                            .split("\\")
                            .pop()}`}
                          alt={doctor.licenseImage.path.split("\\").pop()}
                          className="h-16 w-16 object-cover rounded"
                          onClick={() =>
                            openModal(
                              `http://localhost:8080/uploads/license/${doctor.licenseImage.path
                                .split("\\")
                                .pop()}`
                            )
                          }
                        />
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
          </div>
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        imageUrl={selectedImage || ""}
      />
    </div>
  );
}

export default DoctorsList;
