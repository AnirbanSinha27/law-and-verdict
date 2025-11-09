import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserDevice extends Document {
  userId: string;          // Auth0 user ID
  deviceId: string;        // Unique identifier per device
  userAgent: string;       // Browser/device info
  createdAt: Date;         // Login timestamp
}

const UserDeviceSchema = new Schema<IUserDevice>({
  userId: { type: String, required: true, index: true },
  deviceId: { type: String, required: true, unique: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.UserDevice || mongoose.model<IUserDevice>("UserDevice", UserDeviceSchema);
