import medicalRecordRepository from "../repositories/medicalRecordRepository";

export const getMedicalRecord = async (id: string) => {
  try {
    return await medicalRecordRepository.getMedicalRecord(id);
  } catch (error) {
    throw new Error("Error in fetching record");
  }
};
