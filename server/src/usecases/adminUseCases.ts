import { IAdmin } from "../models/adminModel";
import { AdminResponse } from "../models/authResponseModel";
import { IDoctor } from "../models/doctorModel";
import adminRepository from "../repositories/adminRepository";
import { generateToken } from "../services/tokenService";

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
    const token = generateToken(admin.name);
    return { token, admin };
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

export const getDoctors = async () => {
  try {
    return await adminRepository.findAllDoctors();
  } catch (error) {
    throw new Error("Error while fetching applications");
  }
};

export const getPatients = async () => {
  try {
    return await adminRepository.findAllPatients();
  } catch (error) {
    throw new Error("Error while fetching applications");
  }
};

export const blockDoctor = async (id: string) => {
  console.log("usecases - bolckdr");
  try {
    return await adminRepository.blockDoctor(id);
  } catch (error) {
    throw new Error("Error occurred in blocking");
  }
};

export const unblockDoctor = async (id: string) => {
  try {
    return await adminRepository.unblockDoctor(id);
  } catch (error) {
    throw new Error("Error occurred in unblocking");
  }
};

export const unblockPatient = async (id: string) => {
  try {
    return await adminRepository.unblockPatient(id);
  } catch (error) {
    throw new Error("Error occurred in unblocking");
  }
};

export const blockPatient = async (id: string) => {
  try {
    return await adminRepository.blockPatient(id);
  } catch (error) {
    throw new Error("Error occurred in unblocking");
  }
};
