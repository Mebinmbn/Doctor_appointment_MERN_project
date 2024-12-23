import { IAdmin } from "./adminModel";
import { IPatient } from "./patientModel";

export interface PatientResponse {
  token: string;
  refreshToken: string;
  patient: IPatient;
}

export interface AdminResponse {
  token: string;
  refreshToken: string;
  admin: IAdmin;
}
