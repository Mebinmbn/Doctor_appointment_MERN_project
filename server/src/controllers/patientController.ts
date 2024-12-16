import { Request, Response } from "express";
import {
  bookAppointment,
  conformTimeSlot,
  getDoctors,
  getPatient,
  getTimeSlots,
  ResetPassword,
  signInPatient,
  signUpPatient,
  storePatientDetails,
} from "../usecases/patientUseCases";
import { createNewTimeSlotRecord } from "../repositories/timeSlotsRepository";

const signUp = async (req: Request, res: Response) => {
  try {
    const patient = await signUpPatient(req.body);
    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, patient } = await signInPatient(email, password);
    res.status(200).json({
      success: true,
      token,
      user: { name: patient.firstName, role: patient.role, id: patient._id },
      message: "Successfully Logged in",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const reset = async (req: Request, res: Response) => {
  const { password, email } = req.body;
  try {
    const patient = await ResetPassword(password, email);
    if (patient) {
      res.status(200).json({
        success: true,
        patient,
        message: "Password reseted succesdfully",
      });
      console.log(
        "success: true" + patient + "message: Password reseted succesdfully"
      );
    } else {
      res
        .status(400)
        .json({ success: false, message: "Error in password reset" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

const doctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getDoctors();
    await createNewTimeSlotRecord();

    if (doctors) {
      res
        .status(200)
        .json({ success: true, doctors, message: "Request successfull" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const timeSlots = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const timeSlots = await getTimeSlots(id);

    if (timeSlots) {
      res
        .status(200)
        .json({ success: true, timeSlots, message: "Request successfull" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const patient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const patient = await getPatient(id);
    if (patient) {
      res.status(200).json({
        success: true,
        patient,
        message: "patient detials collected successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

const patientData = async (req: Request, res: Response) => {
  const patientData = req.body;
  console.log(patientData);
  try {
    const patient = await storePatientDetails(patientData);
    if (patient) {
      res.status(200).json({
        success: true,
        patient,
        message: "Patient Details stored successfully",
      });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const book = async (req: Request, res: Response) => {
  const appointmentData = req.body;
  console.log("patient controller", appointmentData);
  try {
    const appointment = await bookAppointment(appointmentData);
    if (appointment) {
      res.status(200).json({
        success: true,
        appointment,
        message: "Appointemnt created successfully",
      });
    } else {
      res.status(400).json({ success: false, message: "Error in booking" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const lockTimeSlot = async (req: Request, res: Response) => {
  const { doctorId, date, time } = req.body;
  try {
    const timeSlot = await conformTimeSlot(doctorId, date, time);
    if (timeSlot) {
      res.status(200).json({
        success: true,
        timeSlot,
        message: "Time slot locked successfully",
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default {
  signUp,
  signIn,
  doctors,
  reset,
  timeSlots,
  patient,
  patientData,
  book,
  lockTimeSlot,
};
