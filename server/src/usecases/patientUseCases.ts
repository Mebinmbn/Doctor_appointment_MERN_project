import patientRepository from "../repositories/patientRepository";
import { IPatient } from "../models/patientModel";
import validation from "../utils/validation";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateToken } from "../services/tokenService";
import { PatientResponse } from "../models/authResponseModel";

export const signUpPatient = async (patientData: IPatient) => {
  console.log("reched useCases", patientData);
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

export const getDoctors = async () => {
  try {
    return await patientRepository.findAllDoctors();
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};
