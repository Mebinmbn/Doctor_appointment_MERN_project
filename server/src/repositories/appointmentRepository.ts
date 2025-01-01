import AppointmentModel from "../models/appointmentModel";

const getAppointmentById = async (id: string) => {
  try {
    const appointment = await AppointmentModel.findById({ _id: id })
      .populate("doctorId", "firstName lastName specialization location")
      .populate("patientId", "firstName lastName gender dob street city");
    if (appointment) {
      return appointment;
    }
  } catch (error) {
    throw new Error("Error in fetching appointment");
  }
};

const updateStatus = async (id: string) => {
  try {
    return await AppointmentModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: "consulted" } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in updating status");
  }
};

export default { getAppointmentById, updateStatus };
