import mongoose, { Document, Schema } from 'mongoose';

export interface IClassName extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  color: string;
  funnelId: string;
  customData?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassNameSchema: Schema<IClassName> = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  funnelId: { type: String, ref: 'Funnel', required: true, index: true },
  customData: { type: String },
}, {
  timestamps: true
});

export const ClassName = mongoose.models.ClassName || mongoose.model<IClassName>('ClassName', ClassNameSchema);