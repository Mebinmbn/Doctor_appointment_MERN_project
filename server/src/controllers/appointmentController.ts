import express, { Request, Response } from "express";
import { getAppointment } from "../usecases/appoinmentUseCases";

const appointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await getAppointment(id);
    res.status(200).json({ success: true, appointment });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { appointment };
