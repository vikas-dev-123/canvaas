import mongoose, { Schema, Model } from "mongoose";

export interface ILane {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  pipelineId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LaneSchema = new Schema<ILane>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pipelineId: {
      type: String,
      ref: "Pipeline",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },
  }
);

export const Lane: Model<ILane> =
  mongoose.models.Lane || mongoose.model<ILane>("Lane", LaneSchema);
