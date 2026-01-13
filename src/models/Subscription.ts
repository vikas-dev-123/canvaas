import mongoose, { Document, Schema } from 'mongoose';
import { Plan } from '../lib/enums';

export interface ISubscription extends Document {
  id?: string; // Added for frontend compatibility
  plan?: string;
  price?: string;
  active: boolean;
  priceId: string;
  customerId: string;
  currentPeriodEndDate: Date;
  subscritiptionId: string;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema({
  plan: { type: String },
  price: { type: String },
  active: { type: Boolean, default: false },
  priceId: { type: String, required: true },
  customerId: { type: String, required: true },
  currentPeriodEndDate: { type: Date, required: true },
  subscritiptionId: { type: String, required: true, unique: true },
  agencyId: { type: String, ref: 'Agency', unique: true },
}, {
  timestamps: true
});

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);