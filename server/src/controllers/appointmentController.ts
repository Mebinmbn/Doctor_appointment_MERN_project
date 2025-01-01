import express, { Request, Response } from "express";
import {
  getAppointment,
  updateAppointmentStatus,
} from "../usecases/appoinmentUseCases";

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

const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await updateAppointmentStatus(id);
    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Status updated successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};
export default { appointment, updateStatus };
