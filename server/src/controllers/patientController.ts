import { Request, Response } from "express";
import {
  bookAppointment,
  cancelAppointment,
  conformTimeSlot,
  getAppointments,
  getDoctors,
  getPatient,
  getPatientNotifications,
  getTimeSlots,
  ResetPassword,
  signInPatient,
  signUpPatient,
  storePatientDetails,
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
    const { token, refreshToken, patient } = await signInPatient(
      email,
      password
    );

    console.log("Generated Refresh Token:");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
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
    query.isBlocked = false;
    console.log(query);

    const { doctors, totalDocs, totalPages } = await getDoctors(
      page,
      limit,
      query
    );

    if (doctors) {
      res.status(200).json({
        success: true,
        data: doctors,
        meta: { page, limit, totalDocs, totalPages },
      });
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "Internal Server Error",
    });
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
  console.log("fetch Patinet controller", id);
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
    const appointment = await bookAppointment(appointmentData, req.app);
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

const appointments = async (req: Request, res: Response) => {
  const { id } = req.params;
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
  try {
    const appointment = await cancelAppointment(id, req.app);

    res
      .status(200)
      .json({ success: true, appointment, message: "Approved successfully" });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const notifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;
    const { notifications, totalDocs, totalPages } =
      await getPatientNotifications(id, page, limit);
    console.log("notifications at controller", notifications);
    res.status(200).json({
      success: true,
      data: notifications,
      meta: {
        page,
        limit,
        totalDocs,
        totalPages,
      },
    });
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
  appointments,
  cancel,
  notifications,
};
