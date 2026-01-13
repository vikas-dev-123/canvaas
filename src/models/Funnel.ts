import mongoose, { Document, Schema } from 'mongoose';

export interface IFunnel extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  subAccountId: string;
  description?: string;
  published: boolean;
  subDomainName?: string;
  favicon?: string;
  liveProducts: string;
  createdAt: Date;
  updatedAt: Date;
}

const FunnelSchema: Schema<IFunnel> = new Schema({
  name: { type: String, required: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
  description: { type: String },
  published: { type: Boolean, default: false },
  subDomainName: { type: String, unique: true },
  favicon: { type: String },
  liveProducts: { type: String, default: "[]" },
}, {
  timestamps: true
});

export const Funnel = mongoose.models.Funnel || mongoose.model<IFunnel>('Funnel', FunnelSchema);