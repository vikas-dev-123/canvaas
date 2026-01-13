import mongoose, { Document, Schema } from 'mongoose';

export interface IPipeline extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineSchema: Schema<IPipeline> = new Schema({
  name: { type: String, required: true },
  subAccountId: { type: String, ref: 'SubAccount', required: true, index: true },
}, {
  timestamps: true
});

export const Pipeline = mongoose.models.Pipeline || mongoose.model<IPipeline>('Pipeline', PipelineSchema);