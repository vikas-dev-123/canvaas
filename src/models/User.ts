import mongoose, { Document, Schema } from 'mongoose';
import { Role } from '../lib/enums';

export interface IUser extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  avatarUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  agencyId?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Role, default: Role.SUBACCOUNT_USER },
  agencyId: { type: String, ref: 'Agency', index: true },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);