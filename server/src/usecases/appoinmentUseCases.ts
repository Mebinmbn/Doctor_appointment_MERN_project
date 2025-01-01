import appointmentRepository from "../repositories/appointmentRepository";

export const getAppointment = async (id: string) => {
  try {
    return await appointmentRepository.getAppointmentById(id);
  } catch (error) {
    throw new Error("Error in fetching appointment");
  }
};

export const updateAppointmentStatus = async (id: string) => {
  try {
    return await appointmentRepository.updateStatus(id);
  } catch (error) {
    throw new Error("Error in updating status");
  }
};
