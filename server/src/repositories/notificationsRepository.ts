import { IAppointment } from "../models/appointmentModel";
import DoctorModel, { IDoctor } from "../models/doctorModel";
import { ILeave } from "../models/leaveModel";
import NotificationModel, { INotification } from "../models/notificationModel";
import PatientModel from "../models/patientModel";
import express, { Application } from "express";

const createAppointmentNotification = async (
  appointment: IAppointment,
  type: string,
  from: string,
  app: Application
) => {
  try {
    let notificationData;
    if (from === "doctor") {
      const doctor = await DoctorModel.findOne({ _id: appointment.doctorId });
      if (!doctor) {
        throw new Error("Doctor not found to create notification");
      }
      let status;
      if (type === "cancelled") {
        status = "cancelled";
      }

      notificationData = {
        recipientId: appointment.userId.toString(),
        senderId: appointment.doctorId.toString(),
        recipientRole: "patient",
        type: type,
        content: `Your appointment to Dr.${doctor.firstName} ${
          doctor.lastName
        } on ${appointment.date.toString().slice(0, 10)} at ${
          appointment.time
        } has been ${status}`,
      };
    } else {
      const patient = await PatientModel.findOne({
        _id: appointment.userId,
      });
      if (!patient) {
        throw new Error("Patient not found to create notification");
      }

      notificationData = {
        recipientId: appointment.doctorId.toString(),
        senderId: appointment.userId.toString(),
        recipientRole: "doctor",
        type: type,
        content: `${patient.firstName} ${
          patient.lastName
        } has applied for an appointment on ${appointment.date
          .toString()
          .slice(0, 10)} at ${appointment.time} `,
      };
    }

    const notification = new NotificationModel(notificationData);
    await notification.save();
    const io = app.get("io");
    if (io) {
      io.to(notification.recipientId).emit("notification", notification);
    } else {
      console.error("Socket.io instance not found on app");
    }
    return notification;
  } catch (error) {
    console.error("Error in creating notification:", error);
    throw new Error("Error in creating notification");
  }
};
//////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////

const applicationsNotification = async (doctor: IDoctor, app: Application) => {
  try {
    let notificationData = {
      recipientId: "6755139cbb339a450c37ecb8",
      senderId: doctor.id.toString(),
      recipientRole: "admin",
      type: "application",
      content: `There is an application from Dr.${doctor.firstName} ${doctor.lastName}`,
    };

    const notification = new NotificationModel(notificationData);
    await notification.save();
    const io = app.get("io");
    if (io) {
      io.to(notification.recipientId).emit("notification", notification);
    } else {
      console.error("Socket.io instance not found on app");
    }
    return notification;
  } catch (error) {
    throw new Error("Error at creating notification");
  }
};

const createLeaveNotification = async (leave: ILeave, app: Application) => {
  try {
    const doctor = await DoctorModel.findOne(leave.doctorId);
    let notificationData = {
      recipientId: "6755139cbb339a450c37ecb8",
      senderId: leave.doctorId.toString(),
      recipientRole: "admin",
      type: "application",
      content: `There is a leave request from Dr.${doctor?.firstName} ${doctor?.lastName}`,
    };

    const notification = new NotificationModel(notificationData);
    await notification.save();
    const io = app.get("io");
    if (io) {
      io.to(notification.recipientId).emit("notification", notification);
    } else {
      console.error("Socket.io instance not found on app");
    }
    return notification;
  } catch (error) {
    throw new Error("Error at creating notification");
  }
};

const markAsRead = async (id: string) => {
  try {
    console.log("mark as read repo", id);
    const response = await NotificationModel.updateMany(
      { recipientId: id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (response) {
      console.log(response);
      return response;
    }
  } catch (error) {
    throw new Error("Error in marking as read");
  }
};

export default {
  createAppointmentNotification,
  getNotifications,
  applicationsNotification,
  createLeaveNotification,
  markAsRead,
};
