import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPayment extends Document {
  userId: Schema.Types.ObjectId;
  appointmentId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  amount: string | undefined;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | undefined;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    amount: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "wallet", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const PaymentModel: Model<IPayment> = mongoose.model<IPayment>(
  "payments",
  PaymentSchema
);

export default PaymentModel;
