import { IAdmin } from "./adminModel";
import { IPatient } from "./patientModel";

export interface PatientResponse {
  token: string;
  patient: IPatient;
}

export interface AdminResponse {
  token: string;
  admin: IAdmin;
}
