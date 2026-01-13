import mongoose, { Document, Schema } from 'mongoose';

export interface ISubAccount extends Document {
  id?: string; // Added for frontend compatibility
  connectAccountId?: string;
  name: string;
  subAccountLogo?: string;
  createdAt: Date;
  updatedAt: Date;
  companyEmail?: string;
  companyPhone: string;
  goal: number;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  agencyId: string;
}

const SubAccountSchema: Schema<ISubAccount> = new Schema({
  connectAccountId: { type: String, default: "" },
  name: { type: String, required: true },
  subAccountLogo: { type: String },
  companyEmail: { type: String },
  companyPhone: { type: String, required: true },
  goal: { type: Number, default: 5 },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  agencyId: { type: String, ref: 'Agency', required: true, index: true },
}, {
  timestamps: true
});

export const SubAccount = mongoose.models.SubAccount || mongoose.model<ISubAccount>('SubAccount', SubAccountSchema);