import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  phone: string;
}

const UserProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

export default models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
