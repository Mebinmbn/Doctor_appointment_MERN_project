interface LicenseImage {
  filename: string;
  originalname: string;
  path: string;
}

export interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  specialization: string;
  experience: string;
  location: string;
  licenseImage: LicenseImage;
  password: string;
  role: string;
  fees: string;
  isVerified: boolean;
  isApproved: boolean;
  isRejected: boolean;
  isBlocked: boolean;
  registeredAt: Date;
}
