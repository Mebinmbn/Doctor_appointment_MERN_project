import { Request, Response } from "express";
import { signInPatient, signUpPatient } from "../usecases/patientUseCases";

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
    res
      .status(200)
      .json({
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
export default { signUp, signIn };
