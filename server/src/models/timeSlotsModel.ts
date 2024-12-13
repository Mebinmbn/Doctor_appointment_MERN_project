import mongoose, { Schema, Model, Document } from "mongoose";
import DoctorModel from "./doctorModel";

export interface ITimeSlots extends Document {
  doctor: Schema.Types.ObjectId;
  date: Date;
  timeSlots: { time: string; isBooked: boolean }[];
}

const timeSlotsSchema: Schema = new Schema<ITimeSlots>({
  doctor: { type: Schema.Types.ObjectId, ref: DoctorModel, required: true },
  date: { type: Date, required: true },
  timeSlots: [
    {
      time: { type: String, required: true },
      isBooked: { type: Boolean, default: false },
    },
  ],
});

const TimeSlotsModel: Model<ITimeSlots> = mongoose.model<ITimeSlots>(
  "TimeSlots",
  timeSlotsSchema
);
export default TimeSlotsModel;
