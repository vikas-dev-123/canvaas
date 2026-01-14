import mongoose, { Document, Schema } from 'mongoose';

export interface IAgency extends Document {
  id: string; // UUID v4 - primary application ID
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
  id: { type: String, required: false }, // Custom id field to store UUID
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

// Ensure the id field is unique if present
AgencySchema.index({ id: 1 }, { unique: true, sparse: true });

export const Agency = mongoose.models.Agency || mongoose.model<IAgency>('Agency', AgencySchema);