import React from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

function PaymentPage() {
  const location = useLocation();
  const { selectedDate, selectedTime, formData, doctor } =
    location.state || null;

  const handleClick = async () => {
    const appointmentData = {
      doctorId: doctor._id,
      patientId: formData.userId,
      date: selectedDate,
      time: selectedTime.time,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/patients/appointments/book",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(
          "Appointment booked successfully, wait for the confirmation"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div>
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
