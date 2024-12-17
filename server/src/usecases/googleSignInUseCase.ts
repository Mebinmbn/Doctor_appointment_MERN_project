import { verifyGoogleToken } from "../services/googleAuthService";
import patientRepository from "../repositories/patientRepository";
import { IPatient } from "../models/patientModel";
import { generateToken } from "../services/tokenService";

export const googleSignIn = async (token: string) => {
  console.log("Reached usecases");
  const payload = (await verifyGoogleToken(token)) as any;
  console.log(payload);
  if (!payload) throw new Error("Invalid Google token");

  let patient = await patientRepository.findPatientByEmail(payload.email);

  if (!patient) {
    const newPatient: Partial<IPatient> = {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      phone: "00000000",
      role: "user",
      isVerified: true,
      password: "googleaccount",
    };
    patient = await patientRepository.createPatient(newPatient);
  } else if (patient.isBlocked) {
    throw new Error("Access denied");
  }

  const jwtoken = generateToken(patient.id, patient.role, patient.isBlocked);

  return { patient, jwtoken };
};
