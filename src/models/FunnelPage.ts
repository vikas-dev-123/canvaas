import mongoose, { Document, Schema } from 'mongoose';

export interface IFunnelPage extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  pathName: string;
  funnelId: string;
  visits: number;
  content?: string;
  order: number;
  previewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FunnelPageSchema: Schema<IFunnelPage> = new Schema({
  name: { type: String, required: true },
  pathName: { type: String, default: "" },
  funnelId: { type: String, ref: 'Funnel', required: true, index: true },
  visits: { type: Number, default: 0 },
  content: { type: String },
  order: { type: Number, required: true },
  previewImage: { type: String },
}, {
  timestamps: true
});

export const FunnelPage = mongoose.models.FunnelPage || mongoose.model<IFunnelPage>('FunnelPage', FunnelPageSchema);