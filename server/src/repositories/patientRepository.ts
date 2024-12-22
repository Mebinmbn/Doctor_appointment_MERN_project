import { query } from "express";
import AppointmentModel, { IAppointment } from "../models/appointmentModel";
import DoctorModel from "../models/doctorModel";
import NotificationModel from "../models/notificationModel";
import PatientDetailsModel, {
  IPatientDetails,
} from "../models/patientDetailsModel";
import PatientModel, { IPatient } from "../models/patientModel";
import TimeSlotsModel from "../models/timeSlotsModel";

const createPatient = async (
  patientData: Partial<IPatient>
): Promise<IPatient> => {
  const patient = new PatientModel(patientData);
  await patient.save();
  return patient;
};
/////////////////////////////////////////////////////////////////////
const findPatientByEmail = async (email: string): Promise<IPatient | null> => {
  return await PatientModel.findOne({ email });
};
/////////////////////////////////////////////////////////////////////
const verifyPatient = async (email: string): Promise<IPatient | null> => {
  const patient = await PatientModel.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );

  return patient;
};
/////////////////////////////////////////////////////////////////////
const resetPassword = async (hashedPassword: string, email: string) => {
  try {
    const patient = await PatientModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return patient;
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};

/////////////////////////////////////////////////////////////////////
const findAllDoctors = async (page: number, limit: number, query: {}) => {
  try {
    const doctors = await DoctorModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await DoctorModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);
    return { doctors, totalDocs, totalPages };
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};

/////////////////////////////////////////////////////////////////////
const getDoctorTimeSlots = async (id: string) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    date.setUTCHours(0, 0, 0, 0);

    return await TimeSlotsModel.find({ doctor: id, date: { $gte: date } })
      .sort({ date: 1 })
      .limit(7);
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};
/////////////////////////////////////////////////////////////////////

const fetchPatientDetails = async (id: string) => {
  try {
    return await PatientModel.findOne({ _id: id });
  } catch (error) {
    throw new Error("Error in fetching patient details");
  }
};

////////////////////////////////////////////////////////////////////////

const createPatientDetails = async (patientData: IPatientDetails) => {
  console.log("create patient details");
  try {
    const patient = new PatientDetailsModel(patientData);
    await patient.save();

    return patient;
  } catch (error) {
    throw new Error("Error in storing patient details");
  }
};
////////////////////////////////////////////////////////////////////////

const checkAppointment = async (appontmentData: IAppointment) => {
  return await AppointmentModel.findOne({
    doctorId: appontmentData.doctorId,
    date: appontmentData.date,
    time: appontmentData.time,
  });
};

////////////////////////////////////////////////////////////////////////

const createAppointment = async (appointmentData: IAppointment) => {
  try {
    const appointment = new AppointmentModel(appointmentData);
    await appointment.save();

    return appointment;
  } catch (error) {
    throw new Error("Error in booking appointment");
  }
};

////////////////////////////////////////////////////////////////////////

const lockTimeSlot = async (doctorId: string, date: string, time: string) => {
  try {
    return await TimeSlotsModel.findOneAndUpdate(
      { doctor: doctorId, date: date },
      { $set: { "timeSlots.$[element].isBooked": true } },
      { arrayFilters: [{ "element.time": time }], new: true }
    );
  } catch (error) {
    throw new Error("Error in locking time slot");
  }
};

const fetchAppointments = async (id: string) => {
  console.log("patient repo", id);
  try {
    const appointments = await AppointmentModel.find({
      patientId: id,
    })
      .sort({ createdAt: -1 })
      .populate("doctorId", "firstName lastName specialization")
      .populate("patientId", "firstName lastName email");

    return appointments;
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

const cancel = async (id: string) => {
  console.log("patient repo");
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

const notifications = async (id: string, page: number, limit: number) => {
  console.log("patient repo", id, page, limit);
  try {
    const notifications = await NotificationModel.find({ recipientId: id })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(notifications);
    const totalDocs = await NotificationModel.countDocuments({
      recipientId: id,
    });
    const totalPages = Math.ceil(totalDocs / limit);
    console.log(totalDocs, totalPages);

    return { notifications, totalDocs, totalPages };
  } catch (error) {
    throw new Error("Error in fetching notifications");
  }
};

export default {
  createPatient,
  findPatientByEmail,
  verifyPatient,
  findAllDoctors,
  resetPassword,
  getDoctorTimeSlots,
  fetchPatientDetails,
  createPatientDetails,
  createAppointment,
  checkAppointment,
  lockTimeSlot,
  fetchAppointments,
  cancel,
  notifications,
};
