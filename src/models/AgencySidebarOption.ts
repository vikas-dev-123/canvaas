import mongoose, { Document, Schema } from 'mongoose';
import { Icon } from '../lib/enums';

export interface IAgencySidebarOption extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  link: string;
  icon: Icon;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgencySidebarOptionSchema: Schema<IAgencySidebarOption> = new Schema({
  name: { type: String, default: "Menu" },
  link: { type: String, default: "#" },
  icon: { type: String, enum: Icon, default: Icon.info },
  agencyId: { type: String, ref: 'Agency', required: true, index: true },
}, {
  timestamps: true
});

export const AgencySidebarOption = mongoose.models.AgencySidebarOption || mongoose.model<IAgencySidebarOption>('AgencySidebarOption', AgencySidebarOptionSchema);