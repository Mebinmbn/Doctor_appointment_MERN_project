import DoctorModel from "../models/doctorModel";
import PatientModel, { IPatient } from "../models/patientModel";

const createPatient = async (
  patientData: Partial<IPatient>
): Promise<IPatient> => {
  console.log("Reached create");
  const patient = new PatientModel(patientData);
  await patient.save();
  return patient;
};
/////////////////////////////////////////////////////////////////////
const findPatientByEmail = async (email: string): Promise<IPatient | null> => {
  return await PatientModel.findOne({ email });
};
/////////////////////////////////////////////////////////////////////
const verifyPatient = async (email: string): Promise<IPatient | null> => {
  const patient = await PatientModel.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );
  console.log("updated patient", patient);
  return patient;
};
/////////////////////////////////////////////////////////////////////
const findAllDoctors = async () => {
  try {
    return await DoctorModel.find({ isApproved: true });
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};
/////////////////////////////////////////////////////////////////////
export default {
  createPatient,
  findPatientByEmail,
  verifyPatient,
  findAllDoctors,
};
