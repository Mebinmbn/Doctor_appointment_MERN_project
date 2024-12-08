import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAdmin {
  name: string;
  email: string;
  role: string;
  password: string;
}

const AdminSchema: Schema = new Schema<IAdmin>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" },
  password: { type: String, required: true },
});

const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>("admins", AdminSchema);
export default AdminModel;
