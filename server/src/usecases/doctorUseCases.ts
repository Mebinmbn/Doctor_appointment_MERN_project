import { IDoctor } from "../models/doctorModel";
import doctorRepository from "../repositories/doctorRepository";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateToken } from "../services/tokenService";
import validation from "../utils/validation";

export const registerDoctor = async (doctorData: IDoctor) => {
  console.log("doctorUsecases", doctorData);
  try {
    validation.validateDoctorRegister(doctorData);

    const exitstingDoctor = await doctorRepository.checkDoctorByEmail(
      doctorData.email
    );
    if (exitstingDoctor) {
      throw new Error("Already applied. Please wait for the approval");
    }
    doctorData.password = await hashPassword(doctorData.password);

    const doctor = await doctorRepository.createDoctor(doctorData);
    return doctor;
  } catch (error) {
    throw new Error("Error in registration");
  }
};

export const signinDoctor = async (email: string, password: string) => {
  try {
    const doctor = await doctorRepository.checkDoctorByEmail(email);
    if (!doctor) {
      throw new Error("Doctor not found");
    } else if (!doctor.isVerified) {
      throw new Error("Doctor is not verified");
    }

    const isPasswordValid = await comparePassword(password, doctor.password);

    if (!isPasswordValid) {
      throw new Error("Invalid creditials");
    }
    const token = generateToken(doctor.id);

    return { token, doctor };
  } catch (error: any) {
    throw new Error(error);
  }
};
