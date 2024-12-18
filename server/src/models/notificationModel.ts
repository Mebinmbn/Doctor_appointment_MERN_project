import mongoose, { Schema, Model, Document } from "mongoose";

export interface INotification extends Document {
  recipientId: string;
  senderId: string;
  recipientRole: string;
  type: string;
  content: string;
  isRead: boolean;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    recipientId: { type: String, required: true },
    senderId: { type: String, required: true },
    recipientRole: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NotificationModel: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
