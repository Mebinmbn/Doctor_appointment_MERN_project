import mongoose from "mongoose";
import AdminModel, { IAdmin } from "../models/adminModel";
import AppointmentModel from "../models/appointmentModel";
import DoctorModel, { IDoctor } from "../models/doctorModel";
import { ILeave } from "../models/leaveModel";
import PatientModel, { IPatient } from "../models/patientModel";
import PaymentModel from "../models/paymentModel";
import TimeSlotsModel from "../models/timeSlotsModel";

const findAdminByEmail = async (email: string): Promise<IAdmin | null> => {
  console.log("Find email by id");
  try {
    return await AdminModel.findOne({ email });
  } catch (error) {
    throw new Error("Admin not found");
  }
};

const findUnapprovedDoctors = async () => {
  try {
    return await DoctorModel.find({
      isApproved: false,

      isRejected: false,
    });
  } catch {
    throw new Error("Error in fetching applications");
  }
};
/////////////////////////////////////////////////////////////////////
const approveDoctor = async (id: string) => {
  try {
    return await DoctorModel.findOneAndUpdate(
      { email: id },
      {
        $set: { isApproved: true },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Approval failed");
  }
};
/////////////////////////////////////////////////////////////////////
const rejectDoctor = async (email: string) => {
  try {
    return await DoctorModel.findOneAndUpdate(
      { email },
      {
        $set: { isRejected: true },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Rejection failed");
  }
};
/////////////////////////////////////////////////////////////////////
const findAllDoctors = async (page: number, limit: number, query: {}) => {
  try {
    const doctors = await DoctorModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocs = await DoctorModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    return { doctors, totalDocs, totalPages };
  } catch {
    throw new Error("Error in fetching applications");
  }
};
/////////////////////////////////////////////////////////////////////
const findAllPatients = async (page: number, limit: number, query: {}) => {
  try {
    const patients = await PatientModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocs = await PatientModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);
    return { patients, totalDocs, totalPages };
  } catch {
    throw new Error("Error in fetching applications");
  }
};
/////////////////////////////////////////////////////////////////////

const blockUnblockDoctor = async (id: string, status: boolean) => {
  try {
    return await DoctorModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isBlocked: status },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in blocking");
  }
};

/////////////////////////////////////////////////////////////////////

const blockUnblockPatient = async (id: string, status: boolean) => {
  try {
    return await PatientModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isBlocked: status },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in unblocking");
  }
};
/////////////////////////////////////////////////////////////////////

const blockPatient = async (id: string) => {
  try {
    return await PatientModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isBlocked: true },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in unblocking");
  }
};

/////////////////////////////////////////////////////////////////////

const updatePatient = async (patientData: IPatient) => {
  console.log("updatePatient");
  try {
    const updateFields: Partial<IPatient> = {
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      phone: patientData.phone,
      gender: patientData.gender,
      dob: patientData.dob,
    };

    if (patientData.password !== "") {
      updateFields.password = patientData.password;
    }
    return await PatientModel.findOneAndUpdate(
      { _id: patientData._id },
      {
        $set: updateFields,
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in unblocking");
  }
};

/////////////////////////////////////////////////////////////////////

const updateDoctor = async (doctorData: IDoctor) => {
  console.log("updatePatient");
  try {
    const updateField: Partial<IDoctor> = {
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      email: doctorData.email,
      phone: doctorData.phone,
      gender: doctorData.gender,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      dob: doctorData.dob,
      fees: doctorData.fees,
    };

    if (doctorData.password !== "") {
      updateField.password = doctorData.password;
    }
    return await DoctorModel.findOneAndUpdate(
      { _id: doctorData._id },
      {
        $set: updateField,
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in unblocking");
  }
};

//////////////////////////////////////////////////////////////////

const fetchAppointments = async () => {
  console.log("doctor repo");
  try {
    const appointments = await AppointmentModel.find({})
      .sort({ createdAt: -1 })
      .populate("doctorId", "firstName lastName specialization")
      .populate("patientId", "firstName lastName email");

    return appointments;
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

/////////////////////////////////////////////////////////////////////

const getDashboardData = async (id: string, period: string | undefined) => {
  try {
    let groupBy;
    switch (period) {
      case "weekly":
        groupBy = { $isoWeek: "$createdAt" };
        break;
      case "monthly":
        groupBy = { $month: "$createdAt" };
        break;
      case "yearly":
        groupBy = { $year: "$createdAt" };
        break;
      default:
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const appointmentCount: number = await AppointmentModel.countDocuments();
    const doctorCount: number = await DoctorModel.countDocuments();
    const patientCount: number = await PatientModel.countDocuments();
    const newPatients = await PatientModel.find({
      registeredAt: { $gt: startDate },
    });

    const chartDate =
      startDate.getDate() -
      (period === "yearly" ? 365 : period === "monthly" ? 30 : 7);

    const revenueData = await PaymentModel.aggregate([
      { $match: { createdAt: { $gt: startDate } } },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: { $toDouble: "$amount" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      appointmentCount,
      doctorCount,
      patientCount,
      newPatients,
      revenueData,
    };
  } catch (error) {
    throw new Error("Error in fetching dashboard data");
  }
};
// /////////////////////////////////////////////////////////
const getPayments = async () => {
  try {
    return await PaymentModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName")
      .populate("doctorId", "firstName");
  } catch (error) {
    throw new Error("Error in fetching payments");
  }
};

//////////////////////////////////////////////////////////////

const deleteTimeSlots = async (leave: ILeave) => {
  try {
    const doctorId = leave.doctorId;
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    const result = await TimeSlotsModel.deleteMany({
      doctor: doctorId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    return result;
  } catch (error) {
    throw new Error("Error in releasing timeSlots");
  }
};

export default {
  findAdminByEmail,
  findUnapprovedDoctors,
  approveDoctor,
  rejectDoctor,
  findAllDoctors,
  findAllPatients,
  blockUnblockDoctor,
  blockUnblockPatient,
  blockPatient,
  updatePatient,
  updateDoctor,
  fetchAppointments,
  getDashboardData,
  getPayments,
  deleteTimeSlots,
};
