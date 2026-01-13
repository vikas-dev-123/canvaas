import mongoose, { Document, Schema } from 'mongoose';
import { TriggerTypes } from '../lib/enums';

export interface ITrigger extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  type: TriggerTypes;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TriggerSchema: Schema<ITrigger> = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: TriggerTypes, required: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Trigger = mongoose.models.Trigger || mongoose.model<ITrigger>('Trigger', TriggerSchema);