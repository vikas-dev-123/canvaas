import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  color: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema<ITag> = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);