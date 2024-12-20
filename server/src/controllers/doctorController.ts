import { Request, Response } from "express";
import {
  cancelAppointment,
  createDoctorTimeSlots,
  getAppointments,
  registerDoctor,
  removeDoctorTimeSlots,
  signinDoctor,
} from "../usecases/doctorUseCases";
import { getTimeSlots } from "../usecases/patientUseCases";
import { ITimeSlots } from "../models/timeSlotsModel";

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

    const doctor = await registerDoctor(doctorData);
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
    const { token, doctor } = await signinDoctor(email, password);
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
  try {
    const appointment = await cancelAppointment(id);

    res
      .status(200)
      .json({ success: true, appointment, message: "Approved successfully" });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

// const reject = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const appointment = await rejectAppointment(id);

//     res
//       .status(200)
//       .json({ success: true, appointment, message: "Rejected successfully" });
//   } catch (error: any) {
//     const errorMessage = error.message || "An unexpected error occurred";
//     res.status(400).json({ success: false, error: errorMessage });
//   }
// };

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
  const { doctorId, date, time } = req.body;
  console.log(doctorId, date, time);
  try {
    const timeSlots = await removeDoctorTimeSlots(doctorId, date, time);
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

export default {
  register,
  signin,
  appointments,
  // approve,
  // reject,
  cancel,
  timeSlots,
  removeTimeSlots,
  createTimeSlots,
};
