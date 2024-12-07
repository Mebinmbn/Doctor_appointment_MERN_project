import { IPatient } from "./patientModel";

export interface AuthResponse {
  token: string;
  patient: IPatient;
}
