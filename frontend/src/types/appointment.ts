import { User } from "./user";
import { Doctor } from "./doctor";

export interface Appointment {
  _id: string;
  doctorId: Doctor;
  userId: string;
  patientId: User;
  date: string;
  time: string;
  payment: string;
  reason: string;
  status: string;
}
