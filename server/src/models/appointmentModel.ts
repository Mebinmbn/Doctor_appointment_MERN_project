import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAppointment {
  doctorId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  patientId: Schema.Types.ObjectId;
  date: Date;
  time: string;
  status?: string;
  payment?: string;
  paymentId?: string;
  amount?: string;
  createdAt?: Date;
}

const AppointmentSchema: Schema = new Schema<IAppointment>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "PatientDetails",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled"],
      default: "pending",
    },
    payment: { type: String, enum: ["pending", "paid"], default: "pending" },
    paymentId: { type: String, unique: true },
    amount: { type: String },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel: Model<IAppointment> = mongoose.model<IAppointment>(
  "appointments",
  AppointmentSchema
);

export default AppointmentModel;
