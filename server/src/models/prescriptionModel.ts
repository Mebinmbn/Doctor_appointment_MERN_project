import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPrescription extends Document {
  appointmentId: Schema.Types.ObjectId;
  prescriptions: [{}];
}

const prescriptionSchema: Schema<IPrescription> = new Schema<IPrescription>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointments",
      required: true,
    },
    prescriptions: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        period: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const prescriptionModel: Model<IPrescription> = mongoose.model(
  "Prescription",
  prescriptionSchema
);

export default prescriptionModel;
