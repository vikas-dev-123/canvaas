import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  id?: string; // Added for frontend compatibility
  notification: string;
  agencyId: string;
  subAccountId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema({
  notification: { type: String, required: true },
  agencyId: { type: String, ref: 'Agency', required: true, index: true },
  subAccountId: { type: String, ref: 'SubAccount', index: true },
  userId: { type: String, ref: 'User', required: true, index: true },
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);