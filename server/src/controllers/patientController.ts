import { Request, Response } from "express";
import {
  getDoctors,
  ResetPassword,
  signInPatient,
  signUpPatient,
} from "../usecases/patientUseCases";

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

const doctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getDoctors();
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
export default { signUp, signIn, doctors, reset };
