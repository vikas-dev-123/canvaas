import mongoose, { Document, Schema } from 'mongoose';

export interface ILane extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  pipelineId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LaneSchema: Schema<ILane> = new Schema({
  name: { type: String, required: true },
  pipelineId: { type: String, ref: 'Pipeline', required: true, index: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const Lane = mongoose.models.Lane || mongoose.model<ILane>('Lane', LaneSchema);