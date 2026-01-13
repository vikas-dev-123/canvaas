import mongoose, { Document, Schema } from 'mongoose';
import { Icon } from '../lib/enums';

export interface ISubAccountSidebarOption extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  link: string;
  icon: Icon;
  subAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubAccountSidebarOptionSchema: Schema<ISubAccountSidebarOption> = new Schema({
  name: { type: String, default: "Menu" },
  link: { type: String, default: "#" },
  icon: { type: String, enum: Icon, default: Icon.info },
  subAccountId: { type: String, ref: 'SubAccount', index: true },
}, {
  timestamps: true
});

export const SubAccountSidebarOption = mongoose.models.SubAccountSidebarOption || mongoose.model<ISubAccountSidebarOption>('SubAccountSidebarOption', SubAccountSidebarOptionSchema);