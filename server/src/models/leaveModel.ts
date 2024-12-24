import mongoose, { Schema, Model, Document } from "mongoose";

export interface ILeave extends Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  leaveType: String;
  startDate: Date;
  endDate: Date;
  status: String;
  reason: String;
}

const LeaveSchema: Schema<ILeave> = new Schema<ILeave>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const LeaveModel: Model<ILeave> = mongoose.model<ILeave>("Leave", LeaveSchema);

export default LeaveModel;
