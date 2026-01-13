import mongoose, { Document, Schema } from 'mongoose';
import { ActionType } from '../lib/enums';

export interface IAction extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  type: ActionType;
  automationId: string;
  order: number;
  laneId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActionSchema: Schema<IAction> = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ActionType, required: true },
  automationId: { type: String, ref: 'Automation', required: true, index: true },
  order: { type: Number, required: true },
  laneId: { type: String, default: "0" },
}, {
  timestamps: true
});

export const Action = mongoose.models.Action || mongoose.model<IAction>('Action', ActionSchema);