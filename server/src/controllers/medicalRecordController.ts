import express, { Request, Response } from "express";
import { getMedicalRecord } from "../usecases/medicalRecordUseCases";

const getRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicalRecord, prescriptions, appointment } =
      await getMedicalRecord(id);
    res.status(200).json({
      success: true,
      data: { medicalRecord, prescriptions, appointment },
      message: "Records fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { getRecord };
