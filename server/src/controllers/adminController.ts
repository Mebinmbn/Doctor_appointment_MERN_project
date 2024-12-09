import { Request, Response } from "express";
import AdminModel from "../models/adminModel";
import {
  approveApplication,
  getApplications,
  getDoctors,
  getPatients,
  rejectApplication,
  signInAdmin,
} from "../usecases/adminUseCases";

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("adminController");
  try {
    const { token, admin } = await signInAdmin(email, password);
    res.status(200).json({
      success: true,
      token,
      user: { name: admin.name, role: admin.role },
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const applications = async (req: Request, res: Response) => {
  try {
    const applications = await getApplications();
    console.log(applications);
    res.status(200).json({
      success: true,
      applications,
      message: "Applications fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const approve = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("id", id);
  try {
    const doctor = await approveApplication(id);
    res.status(200).json({
      success: true,
      doctor,
      message: "Applications approved successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const reject = async (req: Request, res: Response) => {
  const email = req.params.email;
  console.log(email);
  try {
    const doctor = await rejectApplication(email);
    res.status(200).json({
      success: true,
      doctor,
      message: "Applications rejected successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const doctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getDoctors();
    console.log(applications);
    res.status(200).json({
      success: true,
      doctors,
      message: "Doctors fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const patients = async (req: Request, res: Response) => {
  try {
    const patients = await getPatients();
    console.log(applications);
    res.status(200).json({
      success: true,
      patients,
      message: "Doctors fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { signin, applications, approve, reject, doctors, patients };
