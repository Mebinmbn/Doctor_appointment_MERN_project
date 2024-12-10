import mongoose from "mongoose";
import DoctorModel, { IDoctor } from "./../models/doctorModel";

const checkDoctorByEmail = async (email: string): Promise<IDoctor | null> => {
  console.log("check doctor");
  return await DoctorModel.findOne({ email });
};
/////////////////////////////////////////////////////////////////////
const createDoctor = async (doctorData: IDoctor): Promise<IDoctor | null> => {
  const doctor = new DoctorModel(doctorData);
  console.log("Created", doctor);
  await doctor.save();
  return doctor;
};
/////////////////////////////////////////////////////////////////////
const verifyDoctor = async (email: string) => {
  const doctor = await DoctorModel.updateOne(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );
  return doctor;
};
/////////////////////////////////////////////////////////////////////
export default { checkDoctorByEmail, createDoctor, verifyDoctor };
