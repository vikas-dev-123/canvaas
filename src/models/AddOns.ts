import mongoose, { Document, Schema } from 'mongoose';

export interface IAddOns extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  active: boolean;
  priceId: string;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddOnsSchema: Schema<IAddOns> = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  priceId: { type: String, required: true, unique: true },
  agencyId: { type: String, ref: 'Agency' },
}, {
  timestamps: true
});

export const AddOns = mongoose.models.AddOns || mongoose.model<IAddOns>('AddOns', AddOnsSchema);