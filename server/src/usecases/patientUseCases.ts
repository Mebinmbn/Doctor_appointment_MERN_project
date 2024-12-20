import patientRepository from "../repositories/patientRepository";
import { IPatient } from "../models/patientModel";
import validation from "../utils/validation";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateToken } from "../services/tokenService";
import { PatientResponse } from "../models/authResponseModel";
import { IPatientDetails } from "../models/patientDetailsModel";
import { IAppointment } from "../models/appointmentModel";
import notificationsRepository from "../repositories/notificationsRepository";

export const signUpPatient = async (patientData: IPatient) => {
  validation.validatePatientSignup(patientData);
  const existingPatient = await patientRepository.findPatientByEmail(
    patientData.email
  );
  if (existingPatient) {
    throw new Error("User already exist with this email");
  }
  patientData.password = await hashPassword(patientData.password);
  const patient = await patientRepository.createPatient(patientData);
  return patient;
};

export const signInPatient = async (
  email: string,
  password: string
): Promise<PatientResponse> => {
  const patient = await patientRepository.findPatientByEmail(email);
  if (!patient) {
    throw new Error("User not found");
  } else if (!patient.isVerified) {
    throw new Error("User is not verified");
  } else if (patient.isBlocked) {
    throw new Error("Your account is blocked");
  }

  const isPasswordValid = await comparePassword(password, patient.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(patient.id, patient.role, patient.isBlocked);
  return { token, patient };
};

export const ResetPassword = async (password: string, email: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return patientRepository.resetPassword(hashedPassword, email);
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};

export const getDoctors = async () => {
  try {
    return await patientRepository.findAllDoctors();
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};

export const getTimeSlots = async (id: string) => {
  try {
    return await patientRepository.getDoctorTimeSlots(id);
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};

export const getPatient = async (id: string) => {
  try {
    return await patientRepository.fetchPatientDetails(id);
  } catch (error) {
    throw new Error("Error in fetching patient details");
  }
};

export const storePatientDetails = async (patientData: IPatientDetails) => {
  try {
    validation.validatePatientDetails(patientData);
    return await patientRepository.createPatientDetails(patientData);
  } catch (error) {
    throw new Error("Error in storing patient details");
  }
};

export const bookAppointment = async (appointmentData: IAppointment) => {
  try {
    const existingAppointment = await patientRepository.checkAppointment(
      appointmentData
    );
    if (existingAppointment) {
      console.log("Time slot already booked");
      throw new Error("Time slot already booked");
    }
    const appointment = await patientRepository.createAppointment(
      appointmentData
    );
    if (appointment) {
      await notificationsRepository.createAppointmentNotification(
        appointment,
        "applied",
        "patient"
      );
    }
    return appointment;
  } catch (error: any) {
    if (error.message === "Time slot already booked") {
      throw error;
    } else {
      throw new Error("Error in booking appointment: " + error.message);
    }
  }
};

export const conformTimeSlot = async (
  doctorId: string,
  date: string,
  time: string
) => {
  try {
    return await patientRepository.lockTimeSlot(doctorId, date, time);
  } catch (error) {
    throw new Error("Error in locking  timeSlot");
  }
};
