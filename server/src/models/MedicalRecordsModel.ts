import mongoose, { Schema, Model, Document, Mongoose } from "mongoose";

export interface IMedicalRecord {
  doctorId: Schema.Types.ObjectId;
  patientId: Schema.Types.ObjectId;
  appointmentId: Schema.Types.ObjectId;
  symptoms: [string];
  diagnosis: [string];
  tests: [string];
  advice: string;
}

const MedicalRecordSchema: Schema<IMedicalRecord> = new Schema<IMedicalRecord>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
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
