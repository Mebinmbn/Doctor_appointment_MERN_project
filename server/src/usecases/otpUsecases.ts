import { IEmailService } from "../models/emailModel";
import doctorRepository from "../repositories/doctorRepository";
import patientRepository from "../repositories/patientRepository";
import { generateOTP, verifyOTP } from "../services/otpSerevice";

export const sendVerificationEmail = async (
  email: string,
  emailService: IEmailService
) => {
  console.log("otpUsecases");
  const otp = generateOTP(email);
  console.log(otp);
  await emailService.sendOTP(email, otp);
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
      }
    }
    throw new Error("Invalid OTP");
  }
};
