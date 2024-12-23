import { IEmailService } from "../models/emailModel";
import doctorRepository from "../repositories/doctorRepository";
import patientRepository from "../repositories/patientRepository";
import { generateOTP, verifyOTP } from "../services/otpSerevice";

export const sendVerificationEmail = async (
  email: string,
  emailService: IEmailService,
  userType: string
) => {
  console.log("otpUsecases");
  if (userType === "forgotPass_patient") {
    const patient = await patientRepository.findPatientByEmail(email);
    console.log("otp usecases patient", patient);
    if (!patient) {
      throw new Error("Email is not registerd with us");
    }
  }
  const otp = generateOTP(email);
  console.log(otp);
  await emailService.sendOTP(email, otp);
  return otp;
};

export const verifyEmail = async (
  email: string,
  otp: string,
  userType: string
) => {
  const isValidOtp = verifyOTP(email, otp);
  console.log("verifyemail", email, otp, userType);
  if (isValidOtp) {
    if (isValidOtp) {
      if (userType === "patient") {
        return await patientRepository.verifyPatient(email);
      } else if (userType === "doctor") {
        return await doctorRepository.verifyDoctor(email);
      } else if (userType === "forgotPassword") {
        return await patientRepository.findPatientByEmail(email);
      }
    }
    throw new Error("Invalid OTP");
  }
};
