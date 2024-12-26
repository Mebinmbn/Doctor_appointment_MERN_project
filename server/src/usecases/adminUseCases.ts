import { IAdmin } from "../models/adminModel";
import { AdminResponse } from "../models/authResponseModel";
import { IDoctor } from "../models/doctorModel";
import { IPatient } from "../models/patientModel";
import adminRepository from "../repositories/adminRepository";
import leaveRepository from "../repositories/leaveRepository";
import { hashPassword } from "../services/bcryptService";
import { generateRefreshToken, generateToken } from "../services/tokenService";

export const signInAdmin = async (
  email: string,
  password: string
): Promise<AdminResponse> => {
  console.log("Signin admin");
  try {
    const admin = await adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }
    if (admin.password !== password) {
      throw new Error("Invalid Creditials");
    }
    const token = generateToken(admin.id, admin.role, false);
    const refreshToken = generateRefreshToken(admin.id, admin.role, false);
    return { token, refreshToken, admin };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getApplications = async () => {
  try {
    return await adminRepository.findUnapprovedDoctors();
  } catch (error) {
    throw new Error("Error while fetching applications");
  }
};

export const approveApplication = async (id: string) => {
  try {
    return await adminRepository.approveDoctor(id);
  } catch (error) {
    throw new Error("Application not found");
  }
};

export const rejectApplication = async (email: string) => {
  try {
    return await adminRepository.rejectDoctor(email);
  } catch (error) {
    throw new Error("Application not found");
  }
};

export const getDoctors = async (page: number, limit: number, query: {}) => {
  try {
    return await adminRepository.findAllDoctors(page, limit, query);
  } catch (error) {
    throw new Error("Error while fetching applications");
  }
};

export const getPatients = async (page: number, limit: number, query: {}) => {
  try {
    return await adminRepository.findAllPatients(page, limit, query);
  } catch (error) {
    throw new Error("Error while fetching applications");
  }
};

export const blocUnblockDoctor = async (id: string, status: boolean) => {
  console.log("usecases - bolckdr");
  try {
    return await adminRepository.blockUnblockDoctor(id, status);
  } catch (error) {
    throw new Error("Error occurred in blocking");
  }
};

export const blockUnblockPatient = async (id: string, status: boolean) => {
  try {
    return await adminRepository.blockUnblockPatient(id, status);
  } catch (error) {
    throw new Error("Error occurred in unblocking");
  }
};

export const editPatient = async (patientData: IPatient) => {
  try {
    if (patientData.password) {
      patientData.password = await hashPassword(patientData.password);
    }

    return await adminRepository.updatePatient(patientData);
  } catch (error) {
    throw new Error("Error in updation");
  }
};

export const editDoctor = async (doctorData: IDoctor) => {
  try {
    if (doctorData.password) {
      doctorData.password = await hashPassword(doctorData.password);
    }

    return await adminRepository.updateDoctor(doctorData);
  } catch (error) {
    throw new Error("Error in updation");
  }
};

export const getAppointments = async () => {
  try {
    return await adminRepository.fetchAppointments();
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

export const leaveApplications = async (page: number, limit: number) => {
  try {
    const requests = await leaveRepository.findAllRequests(page, limit);
    console.log("usecases", requests);
    return requests;
  } catch (error) {
    throw new Error("Error in fetching requests");
  }
};

export const updateLeaveRequest = async (id: string, status: string) => {
  try {
    return await leaveRepository.updateLeaveStatus(id, status);
  } catch (error) {
    throw new Error("Error in updating  leave request");
  }
};
