import { IDoctor } from "../models/doctorModel";
import { ILeave } from "../models/leaveModel";
import doctorRepository from "../repositories/doctorRepository";
import leaveRepository from "../repositories/leaveRepository";
import notificationsRepository from "../repositories/notificationsRepository";
import timeSlotsRepository from "../repositories/timeSlotsRepository";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateRefreshToken, generateToken } from "../services/tokenService";
import validation from "../utils/validation";
import express, { Application } from "express";
const app = express();
export const registerDoctor = async (doctorData: IDoctor, app: Application) => {
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
    if (doctor) {
      const notification =
        await notificationsRepository.applicationsNotification(doctor, app);
    }
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
      throw new Error("Email is not verified");
    } else if (doctor.isBlocked) {
      throw new Error("Your account is blocked");
    }

    const isPasswordValid = await comparePassword(password, doctor.password);

    if (!isPasswordValid) {
      throw new Error("Invalid creditials");
    }
    const token = generateToken(doctor.id, doctor.role, doctor.isBlocked);
    const refreshToken = generateRefreshToken(
      doctor.id,
      doctor.role,
      doctor.isBlocked
    );

    return { token, refreshToken, doctor };
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

export const cancelAppointment = async (id: string, app: Application) => {
  try {
    const appointment = await doctorRepository.cancel(id);
    if (appointment) {
      const notification =
        await notificationsRepository.createAppointmentNotification(
          appointment,
          "cancelled",
          "doctor",
          app
        );
    }
    return appointment;
  } catch (error) {
    throw new Error("Error in cancelling");
  }
};

// export const rejectAppointment = async (id: string) => {
//   try {
//     const appointment = await doctorRepository.reject(id);
//     if (appointment) {
//       const notification =
//         await notificationsRepository.createAppointmentNotification(
//           appointment,
//           "rejected",
//           "doctor"
//         );
//     }
//     return appointment;
//   } catch (error) {
//     throw new Error("Error in rejection");
//   }
// };

export const createDoctorTimeSlots = async (doctorId: string, slots: []) => {
  try {
    return await timeSlotsRepository.createNewTimeSlotRecord(doctorId, slots);
  } catch (error) {
    throw new Error("Error in creating time slots");
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

export const getDoctorNotifications = async (
  id: string,
  page: number,
  limit: number
) => {
  try {
    return await doctorRepository.notifications(id, page, limit);
  } catch (error) {
    throw new Error("Error in fetching notificaions");
  }
};

export const applyLeave = async (leaveData: ILeave) => {
  try {
    const existing = await leaveRepository.checkExistingLeaveApplication(
      leaveData
    );
    if (existing) {
      throw new Error("Application already exists");
    }
    return await leaveRepository.leaveApplication(leaveData);
  } catch (error) {
    throw new Error("Error in applying leave");
  }
};
