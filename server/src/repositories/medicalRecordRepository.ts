import { ObjectId } from "mongoose";
import MedicalRecordModel, {
  IMedicalRecord,
} from "../models/MedicalRecordsModel";
import prescriptionModel, { IPrescription } from "../models/prescriptionModel";

const checkMedicalRecord = async (appointmentId: ObjectId) => {
  return await MedicalRecordModel.findOne({ appointmentId });
};

const createMedicalRecord = async (
  medicalRecordData: IMedicalRecord,
  prescriptions: any
) => {
  try {
    console.log("prescriptions", prescriptions);
    const medicalRecord = new MedicalRecordModel(medicalRecordData);
    await medicalRecord.save();
    const prescription = new prescriptionModel(prescriptions);
    await prescription.save();
    return { medicalRecord, prescription };
  } catch (error) {
    throw new Error("Error in creating medical record");
  }
};

const getMedicalRecord = async (id: string) => {
  try {
    const medicalRecord = await MedicalRecordModel.findOne({
      appointmentId: id,
    });
    const prescriptions = await prescriptionModel.findOne({
      appointmentId: id,
    });
    return { medicalRecord, prescriptions };
  } catch (error) {
    throw new Error("Error in feteching record");
  }
};

export default { checkMedicalRecord, createMedicalRecord, getMedicalRecord };
