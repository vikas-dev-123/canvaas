import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  email: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);