import AppointmentModel, { IAppointment } from "../models/appointmentModel";
import DoctorModel from "../models/doctorModel";
import PatientDetailsModel, {
  IPatientDetails,
} from "../models/patientDetailsModel";
import PatientModel, { IPatient } from "../models/patientModel";
import TimeSlotsModel from "../models/timeSlotsModel";

const createPatient = async (
  patientData: Partial<IPatient>
): Promise<IPatient> => {
  console.log("Reached create");
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
  console.log("verify paitient");
  const patient = await PatientModel.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );
  console.log("updated patient", patient);
  return patient;
};
/////////////////////////////////////////////////////////////////////
const resetPassword = async (hashedPassword: string, email: string) => {
  console.log("repository - resetPassowrd", hashedPassword, email);

  try {
    const patient = await PatientModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    console.log("updated patient", patient);
    return patient;
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};

/////////////////////////////////////////////////////////////////////
const findAllDoctors = async () => {
  try {
    return await DoctorModel.find({ isApproved: true, isBlocked: false });
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
    console.log(date);
    return await TimeSlotsModel.find({ doctor: id, date: { $gte: date } });
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
  console.log("patientRepo.createPatientDetails", patientData);
  try {
    const patient = new PatientDetailsModel(patientData);
    await patient.save();
    console.log(patient);
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
  console.log("patientRepo.createAppointment", appointmentData);
  try {
    const appointment = new AppointmentModel(appointmentData);
    await appointment.save();
    console.log(appointment);
    return appointment;
  } catch (error) {
    throw new Error("Error in booking appointment");
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
};
