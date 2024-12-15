import patientRepository from "../repositories/patientRepository";
import { IPatient } from "../models/patientModel";
import validation from "../utils/validation";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateToken } from "../services/tokenService";
import { PatientResponse } from "../models/authResponseModel";
import { IPatientDetails } from "../models/patientDetailsModel";
import { IAppointment } from "../models/appointmentModel";

export const signUpPatient = async (patientData: IPatient) => {
  console.log("reached useCases", patientData);
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
  }

  const isPasswordValid = await comparePassword(password, patient.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(patient.id);
  return { token, patient };
};

export const ResetPassword = async (password: string, email: string) => {
  console.log("usecases- reset password");
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
      throw new Error("Time slot already booked");
    }
    return await patientRepository.createAppointment(appointmentData);
  } catch (error) {
    throw new Error("Error in booking appointment");
  }
};
