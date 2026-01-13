import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  id?: string; // Added for frontend compatibility
  type?: string;
  name: string;
  link: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema<IMedia> = new Schema({
  type: { type: String },
  name: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);