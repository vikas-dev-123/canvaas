import mongoose, { Document, Schema } from 'mongoose';

export interface IAgency extends Document {
  id?: string; // Added for frontend compatibility
  connectAccountId?: string;
  customerId: string;
  name: string;
  agencyLogo: string;
  companyEmail: string;
  companyPhone: string;
  whiteLabel: boolean;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  createdAt: Date;
  updatedAt: Date;
  subscriptionId?: string;
}

const AgencySchema: Schema<IAgency> = new Schema({
  connectAccountId: { type: String, default: "" },
  customerId: { type: String, default: "" },
  name: { type: String, required: true },
  agencyLogo: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyPhone: { type: String, required: true },
  whiteLabel: { type: Boolean, default: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  goal: { type: Number, default: 5 },
  subscriptionId: { type: String, ref: 'Subscription' },
}, {
  timestamps: true
});

export const Agency = mongoose.models.Agency || mongoose.model<IAgency>('Agency', AgencySchema);