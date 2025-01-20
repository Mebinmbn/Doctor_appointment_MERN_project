import mongoose, { Schema, Model, Document } from "mongoose";

export interface IChat {
  roomId: string;
  sender: string;
  senderId: string;
  receiver: string;
  recipientId: string;
  text: string;
  timeStamp: Date;
}

const ChatSchema: Schema<IChat> = new Schema<IChat>(
  {
    roomId: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    senderId: { type: String },
    recipientId: { type: String },
    text: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

const ChatModel: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema);

export default ChatModel;
