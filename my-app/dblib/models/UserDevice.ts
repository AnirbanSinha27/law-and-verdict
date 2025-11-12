import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserDevice extends Document {
  userId: string;          // Auth0 user ID
  deviceId: string;        // Unique identifier per device
  userAgent: string;       // Browser/device info
  socketId: string;        // The socket.io client ID
  createdAt: Date;         // When the device first logged in
  lastSeen: Date;          // Updated on page load / heartbeat
}

const UserDeviceSchema = new Schema<IUserDevice>({
  userId: { type: String, required: true, index: true },
  deviceId: { type: String, required: true, unique: true },
  userAgent: { type: String, required: true },
  socketId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
});

export default models.UserDevice ||
  mongoose.model<IUserDevice>("UserDevice", UserDeviceSchema);
