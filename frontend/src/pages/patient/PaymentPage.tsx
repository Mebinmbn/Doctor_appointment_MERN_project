import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Navbar from "../../components/patient/Navbar";
import api from "../../api/api";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, formData, doctor } =
    location.state || null;
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);

  const handleClick = async () => {
    const appointmentData = {
      doctorId: doctor._id,
      patientId: formData.userId,
      date: selectedDate,
      time: selectedTime.time,
    };
    try {
      const response = await api.post(
        "/patients/appointments/book",
        appointmentData,
        {
          headers: {
            "User-Type": "patient",
          },
        }
      );
      if (response.data.success) {
        toast.success(
          "Appointment booked successfully, wait for the confirmation"
        );
      } else {
        toast.error(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "An unexpected error";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Navbar />
      <p>{selectedDate}</p>
      <p>{selectedTime.time}</p>
      <p>{formData.userId}</p>
      <p>{doctor._id}</p>
      <button
        onClick={handleClick}
        className="bg-[#007E85] rounded-lg p-2 text-white w-fit font-bold"
      >
        Pay & Book{" "}
      </button>
    </div>
  );
}

export default PaymentPage;
