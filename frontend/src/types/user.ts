export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  street?: string;
  city?: string;
  password: string;
  isVerified: boolean;
  isRejected: boolean;
  isBlocked: boolean;
  registeredAt: Date;
}
