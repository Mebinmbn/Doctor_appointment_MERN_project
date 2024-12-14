import { Schema } from "mongoose";

export interface TimeSlots {
  doctor: Schema.Types.ObjectId;
  date: Date;
  timeSlots: { time: string; isBooked: boolean }[];
}
