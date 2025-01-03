import mongoose from "mongoose";
import DoctorModel, { IDoctor } from "./../models/doctorModel";
import AppointmentModel from "../models/appointmentModel";
import TimeSlotsModel from "../models/timeSlotsModel";
import NotificationModel from "../models/notificationModel";
import LeaveModel from "../models/leaveModel";

const checkDoctorByEmail = async (email: string): Promise<IDoctor | null> => {
  console.log("check doctor");
  return await DoctorModel.findOne({ email });
};
/////////////////////////////////////////////////////////////////////
const createDoctor = async (doctorData: IDoctor): Promise<IDoctor | null> => {
  const doctor = new DoctorModel(doctorData);
  console.log("Created", doctor);
  await doctor.save();
  return doctor;
};
/////////////////////////////////////////////////////////////////////
const verifyDoctor = async (email: string) => {
  const doctor = await DoctorModel.updateOne(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );
  return doctor;
};
/////////////////////////////////////////////////////////////////////
const fetchAppointments = async (id: string) => {
  console.log("doctor repo", id);
  try {
    const appointments = await AppointmentModel.find({
      doctorId: id,
      status: { $ne: "rejected" },
    })
      .sort({ createdAt: -1 })
      .populate("doctorId", "firstName lastName specialization")
      .populate("patientId", "firstName lastName email");

    return appointments;
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};
/////////////////////////////////////////////////////////////////////
const cancel = async (id: string) => {
  console.log("doctor repo");
  try {
    const appointments = await AppointmentModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "cancelled" } },
      { new: true }
    );
    console.log(appointments);
    return appointments;
  } catch (error) {
    throw new Error("Error in approving appointments");
  }
};

/////////////////////////////////////////////////////////////////////
// const reject = async (id: string) => {
//   console.log("doctor repo", id);
//   try {
//     const appointments = await AppointmentModel.findByIdAndUpdate(
//       { _id: id },
//       { $set: { status: "rejected" } },
//       { new: true }
//     );
//     console.log(appointments);
//     return appointments;
//   } catch (error) {
//     throw new Error("Error in rejecting appointments");
//   }
// };

/////////////////////////////////////////////////////////////////////
const updateTimeSlots = async (
  doctorId: string,
  date: string,
  time: string[]
) => {
  console.log("doctor repo", doctorId, time);
  try {
    const timeSlotRecord = await TimeSlotsModel.findOne({
      doctor: doctorId,
      date: new Date(date),
    });

    if (!timeSlotRecord) {
      throw new Error("Time slot record not found");
    }

    timeSlotRecord.timeSlots = timeSlotRecord.timeSlots.filter(
      (timeSlot) => !time.includes(timeSlot.time)
    );

    await timeSlotRecord.save();
    console.log(timeSlotRecord);
    return timeSlotRecord;
  } catch (error) {
    console.error("Error in updating time slots:", error);
    throw new Error("Error in updating time slots");
  }
};

/////////////////////////////////////////////////////////////////////

const notifications = async (id: string, page: number, limit: number) => {
  try {
    const notifications = await NotificationModel.find({ recipientId: id })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocs = await NotificationModel.countDocuments({
      recipientId: id,
    });
    const totalPages = Math.ceil(totalDocs / limit);
    return { notifications, totalDocs, totalPages };
  } catch (error) {
    throw new Error("Error in fetching notificaions");
  }
};

export default {
  checkDoctorByEmail,
  createDoctor,
  verifyDoctor,
  fetchAppointments,
  cancel,
  // reject,
  updateTimeSlots,
  notifications,
};
