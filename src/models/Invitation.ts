import mongoose, { Document, Schema } from 'mongoose';
import { Role, InvitationStatus } from '../lib/enums';

export interface IInvitation extends Document {
  id?: string; // Added for frontend compatibility
  email: string;
  agencyId: string;
  status: InvitationStatus;
  role: Role;
}

const InvitationSchema: Schema<IInvitation> = new Schema({
  email: { type: String, required: true, unique: true },
  agencyId: { type: String, ref: 'Agency', required: true, index: true },
  status: { type: String, enum: InvitationStatus, default: InvitationStatus.PENDING },
  role: { type: String, enum: Role, default: Role.SUBACCOUNT_USER },
});

export const Invitation = mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);