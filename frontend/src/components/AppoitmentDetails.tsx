import React, { useEffect, useState } from "react";
import api from "../api/api";

import { Appointment } from "../types/appointment";

interface AppointmentProps {
  appointmentId: string | null;
  userType: string | null;
}

const AppoitmentDetails: React.FC<AppointmentProps> = ({
  appointmentId,
  userType,
}) => {
  const [appointment, setAppointment] = useState<Appointment>();

  const fetchAppointmentDetails = async () => {
    try {
      console.log(appointmentId, userType);
      const response = await api.get(`/appointments/${appointmentId}`, {
        headers: { "User-Type": userType },
      });
      if (response.data.success) {
        setAppointment(response.data.appointment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, []);

  return (
    <div className="w-[80vw] border-2 mx-auto mt-10 p-5">
      <div className="text-center mb-5">
        <strong className="text-center text-2xl font-extrabold text-[#007E85]">
          Appointment Details
        </strong>
      </div>
      <div className="ml-auto ">
        <table>
          <tr>
            <td className="w-32">Consultation Id </td>
            <td className="w-5">: </td>
            <td> {appointment?._id}</td>
          </tr>
          <tr>
            <td>Consultaion Date </td>
            <td>: </td>
            <td> {appointment?.date.toString().slice(0, 10)}</td>
          </tr>
        </table>
      </div>
      <div className="bg-gray-200 w-full p-2 py-4 my-3">
        <strong className="text-xl mb-5 text-[#007E85]">
          Dr. {appointment?.doctorId.firstName} {appointment?.doctorId.lastName}
        </strong>
        <p className="text-sm mt-2">
          {appointment?.doctorId.specialization.toUpperCase()}
        </p>
        <p className="text-sm ">
          {appointment?.doctorId.location.toUpperCase()}
        </p>
      </div>
      <div className="flex justify-between w-full p-2 py-4 my-3 border-b-2 border-[#007E85]">
        <div>
          <strong className="text-xl text-[#007E85]">Patient's Details</strong>
          <p>
            {appointment?.patientId.firstName} {appointment?.patientId.lastName}
          </p>
          <p>
            {appointment?.patientId.street}, {appointment?.patientId.city}
          </p>
        </div>
        <div className="py-5">
          <p>
            Date of Birth : {appointment?.patientId.dob.toString().slice(0, 10)}
          </p>
          <p>Gender: {appointment?.patientId.gender}</p>
        </div>
      </div>
      <div className="flex justify-end items-end gap-5 h-20">
        <button className="p-2 h-10 bg-red-500 rounded-lg text-white">
          Cancel Appointment
        </button>
        <button className="p-2 h-10 bg-[#007E85] rounded-lg text-white">
          Join Video Call
        </button>
      </div>
    </div>
  );
};

export default AppoitmentDetails;
