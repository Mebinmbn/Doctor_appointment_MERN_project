interface Doctor {
  firstName: string;
  lastName: string;
}

export interface Leave {
  _id: string;
  doctorId: Doctor;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
}
