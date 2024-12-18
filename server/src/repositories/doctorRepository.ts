import mongoose from "mongoose";
import DoctorModel, { IDoctor } from "./../models/doctorModel";
import AppointmentModel from "../models/appointmentModel";
import TimeSlotsModel from "../models/timeSlotsModel";

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
const approve = async (id: string) => {
  console.log("doctor repo");
  try {
    const appointments = await AppointmentModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "confirmed" } },
      { new: true }
    );
    console.log(appointments);
    return appointments;
  } catch (error) {
    throw new Error("Error in approving appointments");
  }
};

/////////////////////////////////////////////////////////////////////
const reject = async (id: string) => {
  console.log("doctor repo", id);
  try {
    const appointments = await AppointmentModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "rejected" } },
      { new: true }
    );
    console.log(appointments);
    return appointments;
  } catch (error) {
    throw new Error("Error in rejecting appointments");
  }
};

/////////////////////////////////////////////////////////////////////
const updateTimeSlots = async (
  doctorId: string,
  date: string,
  time: string[]
) => {
  console.log("doctor repo", doctorId);
  try {
    const data = await TimeSlotsModel.findOne({
      doctor: doctorId,
      date: date,
    });
    console.log(data);
    if (!data) {
      console.log("no data found");
      throw new Error("No data found");
    }
    const updatedTimeSlots = data.timeSlots.map((slot) => {
      if (time.includes(slot.time)) {
        slot.isBooked = true;
      }
      return slot;
    });
    data.timeSlots = updatedTimeSlots;
    await data.save();
    return data;
  } catch (error) {
    throw new Error("Error in rejecting appointments");
  }
};

export default {
  checkDoctorByEmail,
  createDoctor,
  verifyDoctor,
  fetchAppointments,
  approve,
  reject,
  updateTimeSlots,
};
