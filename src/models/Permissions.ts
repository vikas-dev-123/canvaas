import mongoose, { Document, Schema } from 'mongoose';

export interface IPermissions extends Document {
  id?: string; // Added for frontend compatibility
  email: string;
  subAccountId: string;
  access: boolean;
}

const PermissionsSchema: Schema<IPermissions> = new Schema({
  email: { type: String, ref: 'User', required: true, index: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
  access: { type: Boolean, required: true },
});

export const Permissions = mongoose.models.Permissions || mongoose.model<IPermissions>('Permissions', PermissionsSchema);