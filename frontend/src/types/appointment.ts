import { User } from "./user";
import { Doctor } from "./doctor";

export interface Appointment {
  _id: string;
  doctor: Doctor;
  patientId: User;
  date: string;
  time: string;
  payment: string;
  status: string;
}
