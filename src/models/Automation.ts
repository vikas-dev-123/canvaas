import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomation extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  triggerId?: string;
  published: boolean;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationSchema: Schema<IAutomation> = new Schema({
  name: { type: String, required: true },
  triggerId: { type: String, ref: 'Trigger', index: true },
  published: { type: Boolean, default: false },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Automation = mongoose.models.Automation || mongoose.model<IAutomation>('Automation', AutomationSchema);