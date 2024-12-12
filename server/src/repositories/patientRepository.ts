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
  console.log("verify paitient");
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
    return await DoctorModel.find({ isApproved: true, isBlocked: false });
  } catch (error) {
    throw new Error("Error in fetching doctors");
  }
};
/////////////////////////////////////////////////////////////////////
const resetPassword = async (hashedPassword: string, email: string) => {
  console.log("repository - resetPassowrd", hashedPassword, email);

  try {
    const patient = await PatientModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    console.log("updated patient", patient);
    return patient;
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};
export default {
  createPatient,
  findPatientByEmail,
  verifyPatient,
  findAllDoctors,
  resetPassword,
};
