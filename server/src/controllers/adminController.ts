import { Request, Response } from "express";

import {
  approveApplication,
  blockUnblockPatient,
  blocUnblockDoctor,
  editDoctor,
  editPatient,
  getApplications,
  getAppointments,
  getDashboardData,
  getDoctors,
  getPatients,
  getpayments,
  leaveApplications,
  rejectApplication,
  signInAdmin,
  updateLeaveRequest,
} from "../usecases/adminUseCases";

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("adminController");
  try {
    const { token, refreshToken, admin } = await signInAdmin(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user: { name: admin.name, role: admin.role, id: admin._id },
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const search = (req.query.search as string) || "";
    const specialization = (req.query.specialization as string) || "";
    const gender = (req.query.gender as string) || "";
    const experience = (req.query.experience as string) || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }
    if (gender) {
      query.gender = gender;
    }
    if (experience) {
      query.experience = { $gte: parseInt(experience, 10) };
    }
    query.isApproved = true;
    query.isVerified = true;
    query.isRejected = false;

    const { doctors, totalDocs, totalPages } = await getDoctors(
      page,
      limit,
      query
    );
    console.log(applications);
    res.status(200).json({
      success: true,
      data: doctors,
      meta: { page, limit, totalDocs, totalPages },
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const patients = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const search = (req.query.search as string) || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const { patients, totalDocs, totalPages } = await getPatients(
      page,
      limit,
      query
    );

    res.status(200).json({
      success: true,
      data: patients,
      meta: { page, limit, totalDocs, totalPages },
      message: "Patients fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const blockUnblock = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { role, status } = req.body;
  console.log(role, status);

  let response;
  console.log("controller", role);
  try {
    if (role === "doctor") {
      response = await blocUnblockDoctor(id, status);
    } else {
      response = await blockUnblockPatient(id, status);
    }
    console.log(response);

    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Doctor blocked successfully" });
    } else {
      res.status(400).json({ success: false, error: "Error in blocking" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: "Error in blocking" });
  }
};

const edit = async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);
  let response;
  try {
    if (data.role === "doctor") {
      response = await editDoctor(data);
    } else {
      response = await editPatient(data);
    }

    if (response) {
      res.status(200).json({ success: true, message: "Updated" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

const appointments = async (req: Request, res: Response) => {
  try {
    const appointments = await getAppointments();
    console.log(applications);
    res.status(200).json({
      success: true,
      appointments,
      message: "Appointments fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const requests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) | 1;
    const limit = parseInt(req.query.limit as string) | 7;
    const { requests, totalDocs, totalPages } = await leaveApplications(
      page,
      limit
    );
    console.log("controller", requests);

    res.status(200).json({
      success: true,
      requests,
      meta: { page, limit, totalDocs, totalPages },
      message: "Requests fetched successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await updateLeaveRequest(id, status);
    res
      .status(200)
      .json({ success: true, message: "Leave request updated", data: request });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const dashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const period = req.query.period as string;
    console.log(period);
    const {
      appointmentCount,
      doctorCount,
      patientCount,
      newPatients,
      revenueData,
    } = await getDashboardData(id, period);
    const totalCount = {
      appointmentCount,
      doctorCount,
      patientCount,
    };
    console.log("totalCount", totalCount);
    res.status(200).json({
      success: true,
      data: {
        totalCount,
        newPatients,
        revenueData,
      },
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const payments = async (req: Request, res: Response) => {
  try {
    const payments = await getpayments();
    console.log(payments);

    if (payments) {
      res.status(200).json({
        success: true,
        payments,
        message: "Payments fetched successfully",
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default {
  signin,
  applications,
  approve,
  reject,
  doctors,
  patients,
  edit,
  appointments,
  requests,
  updateRequest,
  blockUnblock,
  dashboard,
  payments,
};
