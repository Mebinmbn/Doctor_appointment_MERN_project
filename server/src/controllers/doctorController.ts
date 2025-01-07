import { Request, Response } from "express";
import {
  applyLeave,
  cancelAppointment,
  createDoctorTimeSlots,
  createMedicalRecord,
  getAppointments,
  getDashboardData,
  getDoctorNotifications,
  getPayments,
  registerDoctor,
  removeDoctorTimeSlots,
  signinDoctor,
} from "../usecases/doctorUseCases";
import { getTimeSlots } from "../usecases/patientUseCases";

const register = async (req: Request, res: Response) => {
  console.log(req.file);
  try {
    if (!req.file) {
      throw new Error("license image is required");
    }

    const path = req.file?.path;
    const originName = req.file?.originalname;
    const fileName = req.file?.fieldname;

    const doctorData = {
      ...req.body,
      licenseImage: {
        filename: fileName,
        originalname: originName,
        path: path,
      },
    };

    const doctor = await registerDoctor(doctorData, req.app);
    if (doctor) {
      res
        .status(200)
        .json({ success: true, message: "Application submitted successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, refreshToken, doctor } = await signinDoctor(email, password);
    console.log("Generated Refresh Token:");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        name: doctor.firstName,
        role: doctor.role,
        id: doctor._id,
        isApproved: doctor.isApproved,
      },
      token,
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const appointments = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("appointments", id);
  try {
    const appointments = await getAppointments(id);

    res.status(200).json({
      success: true,
      appointments,
      message: "Appointments fected successfully",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const cancel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    const appointment = await cancelAppointment(id, reason, req.app);

    res
      .status(200)
      .json({ success: true, appointment, message: "Approved successfully" });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const createTimeSlots = async (req: Request, res: Response) => {
  console.log("doctor timeslots");
  const { id } = req.params;
  const { slots } = req.body;
  console.log(id, slots);
  try {
    const timeSlots = await createDoctorTimeSlots(id, slots);

    if (timeSlots) {
      res.status(200).json({ success: true, timeSlots, message: "" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const timeSlots = async (req: Request, res: Response) => {
  console.log("doctor timeslots");
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

const removeTimeSlots = async (req: Request, res: Response) => {
  const { doctorId, date } = req.params;
  const time = req.body;
  console.log(time.timeSlotsToRemove);
  try {
    const timeSlots = await removeDoctorTimeSlots(
      doctorId,
      date,
      time.timeSlotsToRemove
    );
    if (timeSlots) {
      res.status(200).json({
        success: true,
        timeSlots,
        message: "Time slot locked successfully",
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const notifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) | 1;
    const limit = parseInt(req.query.limit as string) | 5;

    const { notifications, totalDocs, totalPages } =
      await getDoctorNotifications(id, page, limit);

    res.status(200).json({
      success: true,
      data: notifications,
      meta: { page, limit, totalDocs, totalPages },
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

interface UserPayload {
  id: string;
  role: string;
  isBlocked: boolean;
}
declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

const leave = async (req: Request, res: Response) => {
  try {
    const leaveData = { doctorId: req.user?.id, ...req.body };
    const leave = await applyLeave(leaveData, req.app);
    if (leave) {
      res
        .status(200)
        .json({ success: true, leave, message: "Leave applied successfully" });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const medicalRecord = async (req: Request, res: Response) => {
  try {
    const { appointmentId, symptoms, diagnosis, tests, prescriptions, advice } =
      req.body;
    const medicalRecordData = {
      appointmentId,
      symptoms,
      diagnosis,
      tests,
      advice,
    };
    const prescriptionData = {
      appointmentId,
      prescriptions,
    };
    const medicalRecord = await createMedicalRecord(
      medicalRecordData,
      prescriptionData
    );
    if (medicalRecord) {
      res.status(200).json({
        success: true,
        medicalRecord,
        message: "Medical Record Created Successfully",
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const dashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointments = await getDashboardData(id);
    if (appointments) {
      res.status(200).json({
        success: true,
        appointments,
        message: "DashboardData fetched successfully",
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const payments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payments = await getPayments(id);
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
  register,
  signin,
  appointments,
  cancel,
  timeSlots,
  removeTimeSlots,
  createTimeSlots,
  notifications,
  leave,
  medicalRecord,
  dashboard,
  payments,
};
