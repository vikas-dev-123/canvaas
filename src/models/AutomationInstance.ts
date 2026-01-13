import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomationInstance extends Document {
  id?: string; // Added for frontend compatibility
  automationId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationInstanceSchema: Schema<IAutomationInstance> = new Schema({
  automationId: { type: String, ref: 'Automation', required: true, index: true },
  active: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const AutomationInstance = mongoose.models.AutomationInstance || mongoose.model<IAutomationInstance>('AutomationInstance', AutomationInstanceSchema);