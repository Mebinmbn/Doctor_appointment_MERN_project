import AppointmentModel from "../models/appointmentModel";

const getAppointmentById = async (id: string) => {
  try {
    const appointment = await AppointmentModel.findById({ _id: id })
      .sort({ createdAt: -1 })
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

const cancel = async (id: string, reason: string) => {
  console.log("doctor repo");
  try {
    const appointments = await AppointmentModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "cancelled" }, reason: reason },
      { new: true }
    );
    console.log(appointments);

    return appointments;
  } catch (error) {
    throw new Error("Error in approving appointments");
  }
};

export default { getAppointmentById, updateStatus, cancel };
