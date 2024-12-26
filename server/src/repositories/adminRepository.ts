import AdminModel, { IAdmin } from "../models/adminModel";
import AppointmentModel from "../models/appointmentModel";
import DoctorModel, { IDoctor } from "../models/doctorModel";
import PatientModel, { IPatient } from "../models/patientModel";

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
    return await PatientModel.findOneAndUpdate(
      { _id: patientData._id },
      {
        $set: {
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          email: patientData.email,
          phone: patientData.phone,
          gender: patientData.gender,
          dob: patientData.dob,
          password: patientData.password,
        },
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
    return await DoctorModel.findOneAndUpdate(
      { _id: doctorData._id },
      {
        $set: {
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          email: doctorData.email,
          phone: doctorData.phone,
          gender: doctorData.gender,
          specialization: doctorData.specialization,
          experience: doctorData.experience,
          dob: doctorData.dob,
          fees: doctorData.fees,
          password: doctorData.password,
        },
      },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error in unblocking");
  }
};

const fetchAppointments = async () => {
  console.log("doctor repo");
  try {
    const appointments = await AppointmentModel.find({})
      .populate("doctorId", "firstName lastName specialization")
      .populate("patientId", "firstName lastName email");

    return appointments;
  } catch (error) {
    throw new Error("Error in fetching appointments");
  }
};

/////////////////////////////////////////////////////////////////////

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
};
