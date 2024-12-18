import { IAppointment } from "../models/appointmentModel";
import DoctorModel from "../models/doctorModel";
import NotificationModel, { INotification } from "../models/notificationModel";
import PatientModel from "../models/patientModel";

const createAppointmentNotification = async (
  appoinment: IAppointment,
  type: string,
  from: string
) => {
  try {
    let notificationData;
    if (from === "doctor") {
      const doctor = await DoctorModel.findOne({ _id: appoinment.doctorId });
      if (!doctor) {
        throw new Error("Doctor not found to create notification");
      }
      let status;
      if (type === "approved") {
        status = "confirmed";
      } else {
        status = "rejected";
      }

      notificationData = {
        recipientId: appoinment.patientId.toString(),
        senderId: appoinment.doctorId.toString(),
        recipientRole: "patient",
        type: type,
        content: `Your appointment to Dr.${doctor.firstName} ${
          doctor.lastName
        } on ${appoinment.date.toString().slice(0, 10)} at ${
          appoinment.time
        } has been ${status}`,
      };
    } else {
      const patient = await PatientModel.findOne({ _id: appoinment.patientId });
      if (!patient) {
        throw new Error("Patient not found to create notification");
      }

      notificationData = {
        recipientId: appoinment.doctorId.toString(),
        senderId: appoinment.patientId.toString(),
        recipientRole: "doctor",
        type: type,
        content: `${patient.firstName} ${
          patient.lastName
        } has applied for an appointment on ${appoinment.date
          .toString()
          .slice(0, 10)} at ${appoinment.time} `,
      };
      console.log("doctor notifi", notificationData);
    }

    const notification = new NotificationModel(notificationData);
    notification.save();
    return notification;
  } catch (error) {
    throw new Error("Error in creating notification");
  }
};

const getNotifications = async (id: string) => {
  try {
    return await NotificationModel.find({
      recipientId: id,
      isRead: false,
    }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error in fetching notifications");
  }
};

export default { createAppointmentNotification, getNotifications };
