import mongoose, { Schema, Model, Document, Mongoose } from "mongoose";

export interface IMedicalRecord {
  appointmentId: Schema.Types.ObjectId;
  symptoms: [string];
  diagnosis: [string];
  tests: [string];
  advice: string;
}

const MedicalRecordSchema: Schema<IMedicalRecord> = new Schema<IMedicalRecord>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    symptoms: { type: [String] },
    diagnosis: { type: [String] },
    tests: { type: [String] },
    advice: { type: String },
  },
  {
    timestamps: true,
  }
);

const MedicalRecordModel: Model<IMedicalRecord> = mongoose.model(
  "MedicalRecord",
  MedicalRecordSchema
);

export default MedicalRecordModel;
