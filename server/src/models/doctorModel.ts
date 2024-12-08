import mongoose, { Document, Schema, Model } from "mongoose";
import { ObjectId } from "mongoose";

export interface IDoctor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  specialization: string;
  experience: string;
  location: string;
  licenseImage: object;
  password: string;
  role: string;
  isVerified: boolean;
  isApproved: boolean;
  isRejected: boolean;
  registeredAt: Date;
}

const DoctorSchema: Schema = new Schema<IDoctor>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  licenseImage: {
    filename: String,
    originalname: String,
    path: String,
  },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
});

const DoctorModel: Model<IDoctor> = mongoose.model<IDoctor>(
  "Docotor",
  DoctorSchema
);

export default DoctorModel;
