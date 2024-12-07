import { IDoctor } from "../models/doctorModel";
import doctorRepository from "../repositories/doctorRepository";
import { hashPassword } from "../services/bcryptService";
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
