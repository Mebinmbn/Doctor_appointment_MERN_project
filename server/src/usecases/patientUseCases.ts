import patientRepository from "../repositories/patientRepository";
import { IPatient } from "../models/patientModel";
import validation from "../utils/validation";
import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateRefreshToken, generateToken } from "../services/tokenService";
import { PatientResponse } from "../models/authResponseModel";
import { IPatientDetails } from "../models/patientDetailsModel";
import { IAppointment } from "../models/appointmentModel";
import notificationsRepository from "../repositories/notificationsRepository";
import express, { Application } from "express";
import paymentService from "../services/paymentService";
import walletRepository from "../repositories/walletRepository";
import paymentRepository from "../repositories/paymentRepository";
const app = express();

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
  const refreshToken = generateRefreshToken(
    patient.id,
    patient.role,
    patient.isBlocked
  );
  return { token, refreshToken, patient };
};

export const ResetPassword = async (password: string, email: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    return patientRepository.resetPassword(hashedPassword, email);
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};

export const getDoctors = async (page: number, limit: number, query: {}) => {
  try {
    return await patientRepository.findAllDoctors(page, limit, query);
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

export const bookAppointment = async (
  appointmentData: IAppointment,
  app: Application
) => {
  try {
    let paymentMethod;
    const timeSlotData = {
      doctorId: appointmentData.doctorId.toString(),
      date: appointmentData.date.toString(),
      time: appointmentData.time,
    };

    const existingAppointment = await patientRepository.checkAppointment(
      timeSlotData
    );
    if (existingAppointment) {
      console.log("Time slot already booked");
      throw new Error("Time slot already booked");
    }
    if (appointmentData.paymentId?.startsWith("wallet")) {
      paymentMethod = "wallet";
      const transaction = {
        description: "Debit",
        amount: appointmentData.amount,
        date: new Date(),
      };
      await walletRepository.createTransaction(
        transaction,
        appointmentData.userId.toString()
      );
    } else {
      paymentMethod = "online";
    }
    const appointment = await patientRepository.createAppointment(
      appointmentData
    );
    if (appointment) {
      await notificationsRepository.createAppointmentNotification(
        appointment,
        "applied",
        "patient",
        app
      );
      const payment = {
        userId: appointment.userId,
        appointmentId: appointment._id,
        doctorId: appointment.doctorId,
        amount: appointment.amount,
        paymentMethod,
        paymentStatus: "completed",
        transactionId: appointment.paymentId,
      };

      await paymentRepository.savePayment(payment);
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
  time: string,
  status: string
) => {
  try {
    const timeSlotData = {
      doctorId,
      date,
      time,
    };
    const existingAppointment = await patientRepository.checkAppointment(
      timeSlotData
    );
    if (existingAppointment) {
      console.log("Time slot already booked");
      throw new Error("Time slot already booked");
    }
    return await patientRepository.lockTimeSlot(doctorId, date, time, status);
  } catch (error: any) {
    if (error.message === "Time slot already booked") {
      throw error;
    } else throw new Error("Error in locking  timeSlot");
  }
};

export const getAppointments = async (id: string) => {
  try {
    return await patientRepository.fetchAppointments(id);
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

export const cancelAppointment = async (id: string, app: Application) => {
  try {
    const appointment = await patientRepository.cancel(id);
    if (appointment) {
      await notificationsRepository.createAppointmentNotification(
        appointment,
        "cancelled",
        "doctor",
        app
      );

      const transaction = {
        description: "Credit",
        amount: appointment.amount,
        date: new Date(),
      };

      await walletRepository.createTransaction(
        transaction,
        appointment.userId.toString()
      );
    }
    return appointment;
  } catch (error) {
    throw new Error("Error in cancelling");
  }
};

export const getPatientNotifications = async (
  id: string,
  page: number,
  limit: number
) => {
  try {
    return await patientRepository.notifications(id, page, limit);
  } catch (error) {
    throw new Error("Error in fetching notifications");
  }
};

export const createPaymentOrder = async (
  amout: number,
  currency: string,
  timeSlot: {
    doctorId: string;
    date: string;
    time: string;
  }
) => {
  try {
    const existingAppointment = await patientRepository.checkAppointment(
      timeSlot
    );
    if (existingAppointment) {
      console.log("Time slot already booked");
      throw new Error("Time slot already booked");
    }
    return await paymentService.createOrder(amout, currency);
  } catch (error) {
    throw new Error("Error in creating order");
  }
};

export const verifyPayment = async (
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) => {
  try {
    return await paymentService.verify(
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );
  } catch (error) {
    throw new Error("Error in payment verification");
  }
};

export const getWallet = async (id: string) => {
  try {
    return await walletRepository.getWallet(id);
  } catch (error) {
    throw new Error("Error in fetching wallet");
  }
};
