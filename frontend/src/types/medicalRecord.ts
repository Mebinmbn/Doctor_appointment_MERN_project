import { Schema } from "mongoose";

interface MedicalRecord {
  appointmentId: Schema.Types.ObjectId;
  symptoms: [string];
  diagnosis: [string];
  tests: [string];
  advice: string;
  createdAt: string | number | Date;
}

export default MedicalRecord;
