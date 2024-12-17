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
    } else if (doctor.isBlocked) {
      throw new Error("Access denied");
    }

    const isPasswordValid = await comparePassword(password, doctor.password);

    if (!isPasswordValid) {
      throw new Error("Invalid creditials");
    }
    const token = generateToken(doctor.id, doctor.role, doctor.isBlocked);

    return { token, doctor };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAppointments = async (id: string) => {
  console.log("doctor usecases");
  try {
    return await doctorRepository.fetchAppointments(id);
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

export const approveAppointment = async (id: string) => {
  try {
    return await doctorRepository.approve(id);
  } catch (error) {
    throw new Error("Error in approval");
  }
};

export const rejectAppointment = async (id: string) => {
  try {
    return await doctorRepository.reject(id);
  } catch (error) {
    throw new Error("Error in rejection");
  }
};

export const removeDoctorTimeSlots = async (
  doctorId: string,
  date: string,
  time: string[]
) => {
  try {
    return await doctorRepository.updateTimeSlots(doctorId, date, time);
  } catch (error) {
    throw new Error("Error in removing time slots");
  }
};
