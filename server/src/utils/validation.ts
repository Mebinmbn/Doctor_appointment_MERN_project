import { IDoctor } from "../models/doctorModel";
import { IPatientDetails } from "../models/patientDetailsModel";
import { IPatient } from "../models/patientModel";

const validatePatientSignup = (doctorData: IPatient) => {
  console.log("Reached validation");
  if (
    !doctorData.firstName ||
    !doctorData.lastName ||
    !doctorData.email ||
    !doctorData.phone
  ) {
    throw new Error("All fields are required");
  }
  // Additional validation logic can be added here
};

const validatePatientSignin = (doctorData: IPatient) => {
  if (!doctorData.email || !doctorData.password) {
    throw new Error("All fields are required");
  }
};

const validateDoctorRegister = (doctorData: IDoctor) => {
  if (
    !doctorData.firstName ||
    !doctorData.lastName ||
    !doctorData.email ||
    !doctorData.phone ||
    !doctorData.gender ||
    !doctorData.specialization ||
    !doctorData.experience ||
    !doctorData.location ||
    !doctorData.dob ||
    !doctorData.password
  ) {
    throw new Error("All fields are required");
  }
};

const validatePatientDetails = (patientData: IPatientDetails) => {
  if (
    !patientData.userId ||
    !patientData.firstName ||
    !patientData.lastName ||
    !patientData.email ||
    !patientData.phone ||
    !patientData.gender ||
    !patientData.dob ||
    !patientData.houseNo ||
    !patientData.street ||
    !patientData.city ||
    !patientData.pin
  ) {
    throw new Error("All fields are required");
  }
};

export default {
  validatePatientSignup,
  validatePatientSignin,
  validateDoctorRegister,
  validatePatientDetails,
};
