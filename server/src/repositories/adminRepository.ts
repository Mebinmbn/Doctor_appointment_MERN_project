import AdminModel, { IAdmin } from "../models/adminModel";
import DoctorModel from "../models/doctorModel";

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
      isVerified: true,
      isRejected: false,
    });
  } catch {
    throw new Error("Error in fetching applications");
  }
};

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

export default {
  findAdminByEmail,
  findUnapprovedDoctors,
  approveDoctor,
  rejectDoctor,
};
