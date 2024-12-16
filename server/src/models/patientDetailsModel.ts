import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatientDetails extends Document {
  userId: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: Date;
  houseNo: string;
  street: string;
  city: string;
  pin: string;
  createdAt?: Date;
}

const PatientDetailsSchema: Schema = new Schema<IPatientDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "patient", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PatientDetailsModel: Model<IPatientDetails> =
  mongoose.model<IPatientDetails>("PatientDetails", PatientDetailsSchema);

export default PatientDetailsModel;
